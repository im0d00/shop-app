const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllSuppliers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSupplierOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM supplier_orders WHERE supplier_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, city, contact_person } = req.body;
    const supplierId = uuidv4();
    
    await pool.query(
      `INSERT INTO suppliers (id, name, email, phone, address, city, contact_person) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [supplierId, name, email, phone, address, city, contact_person]
    );
    
    res.json({ success: true, message: 'Supplier created', supplierId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, contact_person } = req.body;
    
    await pool.query(
      `UPDATE suppliers SET name = $1, email = $2, phone = $3, address = $4, city = $5, contact_person = $6, updated_at = NOW() WHERE id = $7`,
      [name, email, phone, address, city, contact_person, id]
    );
    
    res.json({ success: true, message: 'Supplier updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { supplier_id, items, total_amount } = req.body;
    const orderId = uuidv4();
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      await client.query(
        `INSERT INTO supplier_orders (id, supplier_id, total_amount, status) 
         VALUES ($1, $2, $3, $4)`,
        [orderId, supplier_id, total_amount, 'pending']
      );
      
      for (const item of items) {
        await client.query(
          `INSERT INTO supplier_order_items (id, order_id, product_id, quantity, unit_price) 
           VALUES ($1, $2, $3, $4, $5)`,
          [uuidv4(), orderId, item.product_id, item.quantity, item.unit_price]
        );
      }
      
      await client.query('COMMIT');
      res.json({ success: true, message: 'Order created', orderId });
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE supplier_orders SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  getSupplierOrders,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createOrder,
  updateOrderStatus,
};
