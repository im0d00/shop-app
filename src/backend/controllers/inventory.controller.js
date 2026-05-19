const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getInventory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pv.*, p.name, p.sku, p.category_id, p.brand 
       FROM product_variants pv 
       LEFT JOIN products p ON pv.product_id = p.id 
       WHERE p.deleted_at IS NULL 
       ORDER BY p.name`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const result = await pool.query(
      `SELECT pv.*, p.name, p.sku 
       FROM product_variants pv 
       LEFT JOIN products p ON pv.product_id = p.id 
       WHERE pv.quantity <= $1 AND p.deleted_at IS NULL 
       ORDER BY pv.quantity ASC`,
      [threshold]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason = 'manual_adjustment' } = req.body;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update variant stock
      await client.query(
        'UPDATE product_variants SET quantity = quantity + $1, updated_at = NOW() WHERE id = $2',
        [quantity, id]
      );
      
      // Log inventory change
      await client.query(
        `INSERT INTO inventory_logs (id, variant_id, quantity_change, reason, changed_by, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [uuidv4(), id, quantity, reason, req.user.id]
      );
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Stock updated' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInventoryHistory = async (req, res) => {
  try {
    const { skip = 0, limit = 100 } = req.query;
    
    const result = await pool.query(
      `SELECT il.*, pv.sku, u.name as changed_by_name 
       FROM inventory_logs il 
       LEFT JOIN product_variants pv ON il.variant_id = pv.id 
       LEFT JOIN users u ON il.changed_by = u.id 
       ORDER BY il.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, skip]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkAdjustStock = async (req, res) => {
  try {
    const { adjustments } = req.body; // Array of { variantId, quantity }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const adj of adjustments) {
        await client.query(
          'UPDATE product_variants SET quantity = quantity + $1 WHERE id = $2',
          [adj.quantity, adj.variantId]
        );
        
        await client.query(
          `INSERT INTO inventory_logs (id, variant_id, quantity_change, reason, changed_by) 
           VALUES ($1, $2, $3, $4, $5)`,
          [uuidv4(), adj.variantId, adj.quantity, 'bulk_adjustment', req.user.id]
        );
      }
      
      await client.query('COMMIT');
      res.json({ success: true, message: `${adjustments.length} items adjusted` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInventoryAnalytics = async (req, res) => {
  try {
    const totalStock = await pool.query(
      'SELECT COUNT(*) as count, SUM(quantity) as total_quantity FROM product_variants'
    );
    
    const lowStock = await pool.query(
      'SELECT COUNT(*) as count FROM product_variants WHERE quantity <= 10'
    );
    
    const outOfStock = await pool.query(
      'SELECT COUNT(*) as count FROM product_variants WHERE quantity = 0'
    );
    
    res.json({
      success: true,
      data: {
        totalVariants: totalStock.rows[0].count,
        totalQuantity: totalStock.rows[0].total_quantity,
        lowStockCount: lowStock.rows[0].count,
        outOfStockCount: outOfStock.rows[0].count,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInventory,
  getLowStockProducts,
  updateStock,
  getInventoryHistory,
  bulkAdjustStock,
  getInventoryAnalytics,
};
