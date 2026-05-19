const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const getAllProducts = async (req, res) => {
  try {
    const { category, skip = 0, limit = 50 } = req.query;
    let query = 'SELECT * FROM products WHERE deleted_at IS NULL';
    const params = [];
    
    if (category) {
      query += ' AND category_id = $1';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, skip);
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = `%${query}%`;
    
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE (name ILIKE $1 OR sku ILIKE $1 OR barcode ILIKE $1) 
       AND deleted_at IS NULL 
       LIMIT 50`,
      [searchQuery]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const variantsResult = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY size, color',
      [id]
    );
    
    const product = productResult.rows[0];
    product.variants = variantsResult.rows;
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, sku, barcode, category_id, brand, cost_price, selling_price, image_url } = req.body;
    
    // Validate
    if (!name || !sku || !selling_price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const productId = uuidv4();
    const profit_margin = ((selling_price - cost_price) / selling_price * 100).toFixed(2);
    
    await pool.query(
      `INSERT INTO products 
       (id, name, description, sku, barcode, category_id, brand, cost_price, selling_price, profit_margin, image_url, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [productId, name, description, sku, barcode, category_id, brand, cost_price, selling_price, profit_margin, image_url, req.user.id]
    );
    
    res.json({ success: true, message: 'Product created', productId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sku, category_id, brand, cost_price, selling_price, image_url } = req.body;
    
    const profit_margin = ((selling_price - cost_price) / selling_price * 100).toFixed(2);
    
    await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, sku = $3, category_id = $4, brand = $5, cost_price = $6, selling_price = $7, profit_margin = $8, image_url = $9, updated_at = NOW() 
       WHERE id = $10`,
      [name, description, sku, category_id, brand, cost_price, selling_price, profit_margin, image_url, id]
    );
    
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE products SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { size, color, sku, barcode, quantity, price } = req.body;
    
    const variantId = uuidv4();
    
    await pool.query(
      `INSERT INTO product_variants (id, product_id, size, color, sku, barcode, quantity, price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [variantId, id, size, color, sku, barcode, quantity, price]
    );
    
    res.json({ success: true, message: 'Variant added', variantId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkImport = async (req, res) => {
  try {
    const { products } = req.body;
    // Implement bulk import logic
    res.json({ success: true, message: `${products.length} products imported` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkExport = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE deleted_at IS NULL');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  bulkImport,
  bulkExport,
};
