const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllSales = async (req, res) => {
  try {
    const { startDate, endDate, skip = 0, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM sales WHERE deleted_at IS NULL';
    const params = [];
    let paramCount = 1;
    
    if (startDate && endDate) {
      query += ` AND created_at >= $${paramCount} AND created_at <= $${paramCount + 1}`;
      params.push(startDate, endDate);
      paramCount += 2;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, skip);
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const saleResult = await pool.query(
      'SELECT * FROM sales WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    
    if (saleResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    const itemsResult = await pool.query(
      'SELECT * FROM sale_items WHERE sale_id = $1',
      [id]
    );
    
    const sale = saleResult.rows[0];
    sale.items = itemsResult.rows;
    
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const { items, customer_id, discount, tax, payment_method, total_amount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in sale' });
    }
    
    const saleId = uuidv4();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create sale
      await client.query(
        `INSERT INTO sales (id, customer_id, discount, tax, total_amount, payment_method, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [saleId, customer_id, discount || 0, tax || 0, total_amount, payment_method, req.user.id]
      );
      
      // Add items and update inventory
      for (const item of items) {
        const saleItemId = uuidv4();
        
        await client.query(
          `INSERT INTO sale_items (id, sale_id, variant_id, quantity, price, subtotal) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [saleItemId, saleId, item.variant_id, item.quantity, item.price, item.subtotal]
        );
        
        // Update inventory
        await client.query(
          'UPDATE product_variants SET quantity = quantity - $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
        
        // Log inventory change
        await client.query(
          `INSERT INTO inventory_logs (id, variant_id, quantity_change, reason, changed_by) 
           VALUES ($1, $2, $3, $4, $5)`,
          [uuidv4(), item.variant_id, -item.quantity, 'sale', req.user.id]
        );
      }
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Sale created', saleId });
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

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, tax, total_amount, payment_method } = req.body;
    
    await pool.query(
      `UPDATE sales SET discount = $1, tax = $2, total_amount = $3, payment_method = $4, updated_at = NOW() WHERE id = $5`,
      [discount, tax, total_amount, payment_method, id]
    );
    
    res.json({ success: true, message: 'Sale updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE sales SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
    
    res.json({ success: true, message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refundSale = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get sale items
      const itemsResult = await client.query(
        'SELECT * FROM sale_items WHERE sale_id = $1',
        [id]
      );
      
      // Restore inventory
      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE product_variants SET quantity = quantity + $1 WHERE id = $2',
          [item.quantity, item.variant_id]
        );
        
        await client.query(
          `INSERT INTO inventory_logs (id, variant_id, quantity_change, reason, changed_by) 
           VALUES ($1, $2, $3, $4, $5)`,
          [uuidv4(), item.variant_id, item.quantity, 'refund', req.user.id]
        );
      }
      
      // Mark sale as refunded
      await client.query(
        'UPDATE sales SET status = $1, updated_at = NOW() WHERE id = $2',
        ['refunded', id]
      );
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Sale refunded' });
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

const printReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement receipt printing logic
    res.json({ success: true, message: 'Receipt generated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDailySales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as total 
       FROM sales WHERE deleted_at IS NULL AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlySales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE_TRUNC('month', created_at)::date as month, COUNT(*) as count, SUM(total_amount) as total 
       FROM sales WHERE deleted_at IS NULL AND created_at >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', created_at) 
       ORDER BY month DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  refundSale,
  printReceipt,
  getDailySales,
  getMonthlySales,
};
