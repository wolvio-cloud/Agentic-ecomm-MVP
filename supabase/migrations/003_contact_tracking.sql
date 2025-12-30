-- Contact Events Table for tracking buyer interactions
CREATE TABLE IF NOT EXISTS contact_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'copy')),
  buyer_city VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_events_product ON contact_events(product_id);
CREATE INDEX IF NOT EXISTS idx_contact_events_created ON contact_events(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_events_channel ON contact_events(channel);

-- Add contact_count column to products if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;

-- Function to increment product contact count
CREATE OR REPLACE FUNCTION increment_contact_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET contact_count = COALESCE(contact_count, 0) + 1
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment on contact event insert
DROP TRIGGER IF EXISTS trigger_increment_contact ON contact_events;
CREATE TRIGGER trigger_increment_contact
AFTER INSERT ON contact_events
FOR EACH ROW
EXECUTE FUNCTION increment_contact_count();

-- Row Level Security
ALTER TABLE contact_events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create contact events
CREATE POLICY "Anyone can create contact events" ON contact_events
  FOR INSERT WITH CHECK (true);

-- Policy: Users can view contact events for their own products
CREATE POLICY "Sellers can view own product contacts" ON contact_events
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE seller_id = auth.uid()
    )
  );

-- Function to get contact stats for a product
CREATE OR REPLACE FUNCTION get_product_contact_stats(product_uuid UUID)
RETURNS TABLE (
  total_contacts BIGINT,
  whatsapp_contacts BIGINT,
  sms_contacts BIGINT,
  copy_contacts BIGINT,
  unique_cities BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_contacts,
    COUNT(*) FILTER (WHERE channel = 'whatsapp') as whatsapp_contacts,
    COUNT(*) FILTER (WHERE channel = 'sms') as sms_contacts,
    COUNT(*) FILTER (WHERE channel = 'copy') as copy_contacts,
    COUNT(DISTINCT buyer_city) as unique_cities
  FROM contact_events
  WHERE product_id = product_uuid;
END;
$$ LANGUAGE plpgsql;
