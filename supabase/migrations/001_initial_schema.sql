-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (sellers only)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  country_code VARCHAR(5) DEFAULT '+91',
  city VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Image
  image_url TEXT NOT NULL,
  image_blurhash VARCHAR(50), -- For loading placeholder

  -- AI-suggested fields (editable by seller)
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  color VARCHAR(30),
  size VARCHAR(20),

  -- Seller-controlled fields
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  quantity INTEGER DEFAULT 1,

  -- Location (from seller's profile + geolocation)
  city VARCHAR(100),
  region VARCHAR(100),
  country VARCHAR(50) DEFAULT 'India',
  country_code VARCHAR(2) DEFAULT 'IN',

  -- Status
  status VARCHAR(20) DEFAULT 'live' CHECK (status IN ('live', 'sold', 'expired', 'deleted')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),

  -- Metadata
  views INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for feed performance
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_location ON products(country_code, region);
CREATE INDEX idx_products_expires ON products(expires_at) WHERE status = 'live';

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view live products"
  ON products FOR SELECT
  USING (status = 'live');

CREATE POLICY "Sellers can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = seller_id);

-- Function: Auto-expire products
CREATE OR REPLACE FUNCTION expire_old_products()
RETURNS void AS $$
BEGIN
  UPDATE products
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'live' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment view count
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET views = views + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Increment WhatsApp clicks
CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Storage policy: Anyone can view images
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
