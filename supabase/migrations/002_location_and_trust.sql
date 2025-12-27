-- Migration 002: Location-Based Filtering & Trust Signals
-- Run date: 2025-01-XX
-- Purpose: Add PostGIS support, seller reputation, and extended expiry

-- ============================================================================
-- STEP 1: Enable PostGIS Extension
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- STEP 2: Add Location Columns
-- ============================================================================

-- Add coordinates to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);

-- Add coordinates to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);

-- ============================================================================
-- STEP 3: Add Reputation & Trust Columns
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS total_listings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_contacts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- STEP 4: Add Renewal Tracking
-- ============================================================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS renewal_count INTEGER DEFAULT 0;

-- ============================================================================
-- STEP 5: Update Expiry Default (48h → 7 days)
-- ============================================================================

ALTER TABLE products
ALTER COLUMN expires_at SET DEFAULT (NOW() + INTERVAL '7 days');

-- ============================================================================
-- STEP 6: Create Spatial Index
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_coordinates
ON products USING GIST (coordinates);

-- ============================================================================
-- STEP 7: Function - Get Nearby Products
-- ============================================================================

CREATE OR REPLACE FUNCTION get_nearby_products(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE status = 'live'
    AND coordinates IS NOT NULL
    AND ST_DWithin(
      coordinates,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY
    ST_Distance(
      coordinates,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ),
    created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 8: Function - Renew Listing
-- ============================================================================

CREATE OR REPLACE FUNCTION renew_listing(p_product_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_seller_id UUID;
BEGIN
  -- Get seller ID and verify ownership
  SELECT seller_id INTO v_seller_id FROM products WHERE id = p_product_id;

  IF v_seller_id != auth.uid() THEN
    RETURN FALSE;
  END IF;

  -- Extend expiry by 7 days
  UPDATE products
  SET
    expires_at = NOW() + INTERVAL '7 days',
    status = 'live',
    renewal_count = renewal_count + 1,
    updated_at = NOW()
  WHERE id = p_product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 9: Function - Update Seller Stats
-- ============================================================================

CREATE OR REPLACE FUNCTION update_seller_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total listings count
  UPDATE users
  SET total_listings = (
    SELECT COUNT(*) FROM products
    WHERE seller_id = NEW.seller_id AND status = 'live'
  )
  WHERE id = NEW.seller_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for seller stats
DROP TRIGGER IF EXISTS trigger_update_seller_stats ON products;
CREATE TRIGGER trigger_update_seller_stats
  AFTER INSERT OR UPDATE OF status ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_stats();

-- ============================================================================
-- STEP 10: Populate Coordinates for Demo Data (Indian Cities)
-- ============================================================================

-- Tiruppur, Tamil Nadu
UPDATE products
SET coordinates = ST_SetSRID(ST_MakePoint(77.3411, 11.1085), 4326)
WHERE city ILIKE '%tiruppur%' AND coordinates IS NULL;

UPDATE users
SET coordinates = ST_SetSRID(ST_MakePoint(77.3411, 11.1085), 4326)
WHERE city ILIKE '%tiruppur%' AND coordinates IS NULL;

-- Chennai, Tamil Nadu
UPDATE products
SET coordinates = ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)
WHERE city ILIKE '%chennai%' AND coordinates IS NULL;

UPDATE users
SET coordinates = ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)
WHERE city ILIKE '%chennai%' AND coordinates IS NULL;

-- Bangalore, Karnataka
UPDATE products
SET coordinates = ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)
WHERE city ILIKE '%bangalore%' AND coordinates IS NULL;

UPDATE users
SET coordinates = ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)
WHERE city ILIKE '%bangalore%' AND coordinates IS NULL;

-- Mumbai, Maharashtra
UPDATE products
SET coordinates = ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)
WHERE city ILIKE '%mumbai%' AND coordinates IS NULL;

UPDATE users
SET coordinates = ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)
WHERE city ILIKE '%mumbai%' AND coordinates IS NULL;

-- Delhi
UPDATE products
SET coordinates = ST_SetSRID(ST_MakePoint(77.1025, 28.7041), 4326)
WHERE city ILIKE '%delhi%' AND coordinates IS NULL;

UPDATE users
SET coordinates = ST_SetSRID(ST_MakePoint(77.1025, 28.7041), 4326)
WHERE city ILIKE '%delhi%' AND coordinates IS NULL;

-- ============================================================================
-- STEP 11: Update Database Types for TypeScript
-- ============================================================================

-- Create view for products with seller info
CREATE OR REPLACE VIEW products_with_seller AS
SELECT
  p.*,
  u.phone_verified as seller_verified,
  u.total_listings as seller_listings,
  u.total_contacts as seller_contacts,
  u.phone as seller_phone,
  u.country_code as seller_country_code
FROM products p
LEFT JOIN users u ON p.seller_id = u.id
WHERE p.status = 'live';

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Verify PostGIS installation
SELECT PostGIS_version();

-- Check products with coordinates
SELECT COUNT(*) as products_with_location
FROM products
WHERE coordinates IS NOT NULL;

-- Check spatial index
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename = 'products' AND indexname LIKE '%coordinates%';
