-- Demo Data Seed Script for SnapSell MVP
-- Creates a demo seller and 50 diverse product listings

-- Insert demo seller
INSERT INTO users (id, phone, phone_verified, city, region, country_code)
VALUES
  ('11111111-1111-1111-1111-111111111111', '+919876543210', true, 'Tiruppur', 'Tamil Nadu', '+91')
ON CONFLICT (id) DO NOTHING;

-- Insert 50 demo products with variety
INSERT INTO products (seller_id, image_url, title, category, color, size, price, currency, city, region, country, country_code, status) VALUES
  -- Tiruppur Textiles (20 items)
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'Cotton Round Neck T-Shirt', 'Clothing', 'White', 'M', 150, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'Premium Black Polo', 'Clothing', 'Black', 'L', 299, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', 'Casual Blue Denim Shirt', 'Clothing', 'Blue', 'M', 450, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 'Striped Cotton Tee', 'Clothing', 'Multicolor', 'S', 180, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800', 'Vintage Graphic T-Shirt', 'Clothing', 'Gray', 'XL', 220, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800', 'Plain Red Crew Neck', 'Clothing', 'Red', 'M', 170, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800', 'Navy Blue Hoodie', 'Clothing', 'Navy', 'L', 599, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=800', 'Summer Tank Top', 'Clothing', 'Yellow', 'S', 120, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800', 'Long Sleeve Henley', 'Clothing', 'Olive', 'M', 340, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800', 'White Linen Shirt', 'Clothing', 'White', 'L', 480, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', 'Pink Cotton Tee', 'Clothing', 'Pink', 'S', 160, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 'Formal White Shirt', 'Clothing', 'White', 'M', 550, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800', 'Green Polo Shirt', 'Clothing', 'Green', 'L', 320, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'Oversized Black Tee', 'Clothing', 'Black', 'XL', 280, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', 'Checked Casual Shirt', 'Clothing', 'Blue', 'M', 390, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'Sports Jersey', 'Clothing', 'Red', 'L', 450, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618354691792-d1d42acfd4cf?w=800', 'Pocket T-Shirt', 'Clothing', 'Gray', 'M', 200, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800', 'V-Neck Sweater', 'Clothing', 'Beige', 'L', 650, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800', 'Printed Graphic Tee', 'Clothing', 'White', 'M', 240, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618354691551-44de113f0164?w=800', 'Classic Crew Neck', 'Clothing', 'Black', 'S', 190, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),

  -- Electronics (10 items)
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Wireless Headphones', 'Electronics', 'Black', NULL, 1299, 'INR', 'Chennai', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'Portable Speaker', 'Electronics', 'Blue', NULL, 899, 'INR', 'Bangalore', 'Karnataka', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800', 'Phone Stand', 'Electronics', 'Silver', NULL, 199, 'INR', 'Mumbai', 'Maharashtra', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1591290619762-c0c5d90e73e2?w=800', 'USB Cable Set', 'Electronics', 'White', NULL, 149, 'INR', 'Delhi', 'Delhi', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', 'Power Bank 10000mAh', 'Electronics', 'Black', NULL, 799, 'INR', 'Chennai', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', 'Laptop Stand', 'Electronics', 'Gray', NULL, 599, 'INR', 'Bangalore', 'Karnataka', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 'LED Desk Lamp', 'Electronics', 'White', NULL, 449, 'INR', 'Hyderabad', 'Telangana', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800', 'Wireless Mouse', 'Electronics', 'Black', NULL, 349, 'INR', 'Pune', 'Maharashtra', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', 'Smart Watch Band', 'Electronics', 'Blue', NULL, 249, 'INR', 'Chennai', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Phone Case Set', 'Electronics', 'Clear', NULL, 299, 'INR', 'Bangalore', 'Karnataka', 'India', 'IN', 'live'),

  -- Home & Accessories (10 items)
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1602006289877-e66957e9f270?w=800', 'Ceramic Plant Pot', 'Home', 'Terracotta', 'Medium', 180, 'INR', 'Jaipur', 'Rajasthan', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'Wall Clock', 'Home', 'Black', NULL, 399, 'INR', 'Kolkata', 'West Bengal', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800', 'Throw Cushion Cover', 'Home', 'Beige', '45x45cm', 220, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1595526051245-207b302926ee?w=800', 'Yoga Mat', 'Home', 'Purple', NULL, 599, 'INR', 'Mumbai', 'Maharashtra', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800', 'Water Bottle', 'Home', 'Blue', '1L', 299, 'INR', 'Chennai', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800', 'Spice Jar Set', 'Home', 'Clear', NULL, 349, 'INR', 'Bangalore', 'Karnataka', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800', 'Bamboo Cutting Board', 'Home', 'Natural', 'Large', 450, 'INR', 'Kochi', 'Kerala', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800', 'Photo Frame Set', 'Home', 'Black', '4x6', 280, 'INR', 'Ahmedabad', 'Gujarat', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1614177820649-0bf979015f49?w=800', 'Scented Candle', 'Home', 'White', NULL, 320, 'INR', 'Pune', 'Maharashtra', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800', 'Storage Basket', 'Home', 'Natural', 'Medium', 380, 'INR', 'Chennai', 'Tamil Nadu', 'India', 'IN', 'live'),

  -- Textiles & Crafts (10 items)
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1610564558732-0e3498c93f8d?w=800', 'Handwoven Table Runner', 'Textiles', 'Red', '180x30cm', 550, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 'Silk Scarf', 'Textiles', 'Blue', NULL, 799, 'INR', 'Mysore', 'Karnataka', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800', 'Cotton Bedsheet', 'Textiles', 'White', 'Queen', 899, 'INR', 'Tiruppur', 'Tamil Nadu', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800', 'Handmade Macrame', 'Crafts', 'Beige', NULL, 650, 'INR', 'Goa', 'Goa', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800', 'Embroidered Cushion', 'Textiles', 'Multicolor', '40x40cm', 480, 'INR', 'Jaipur', 'Rajasthan', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800', 'Pottery Vase', 'Crafts', 'Terracotta', 'Medium', 420, 'INR', 'Pondicherry', 'Pondicherry', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=800', 'Woven Wall Hanging', 'Crafts', 'Natural', NULL, 890, 'INR', 'Udaipur', 'Rajasthan', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800', 'Block Print Fabric', 'Textiles', 'Indigo', '2m', 350, 'INR', 'Jaipur', 'Rajasthan', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800', 'Handwoven Basket', 'Crafts', 'Natural', 'Small', 299, 'INR', 'Manipur', 'Manipur', 'India', 'IN', 'live'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800', 'Brass Diya Set', 'Crafts', 'Gold', NULL, 450, 'INR', 'Varanasi', 'Uttar Pradesh', 'India', 'IN', 'live')
ON CONFLICT DO NOTHING;

-- Verify data
SELECT COUNT(*) as total_products FROM products WHERE status = 'live';
SELECT COUNT(*) as total_users FROM users;
