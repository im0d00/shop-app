const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllCustomers = async (req, res) => {
  try {
    const { skip = 0, limit = 50 } = req.query;
    
    const result = await pool.query(
      'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, skip]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchCustomers = async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = `%${query}%`;
    
    const result = await pool.query(
      `SELECT * FROM customers WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1 LIMIT 50`,
      [searchQuery]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT s.* FROM sales s WHERE s.customer_id = $1 AND s.deleted_at IS NULL ORDER BY s.created_at DESC`,
      [id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    const customerId = uuidv4();
    
    await pool.query(
      `INSERT INTO customers (id, name, phone, email, loyalty_points, credit_balance) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customerId, name, phone, email, 0, 0]
    );
    
    res.json({ success: true, message: 'Customer created', customerId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    await pool.query(
      'UPDATE customers SET name = $1, phone = $2, email = $3, updated_at = NOW() WHERE id = $4',
      [name, phone, email, id]
    );
    
    res.json({ success: true, message: 'Customer updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addLoyaltyPoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;
    
    await pool.query(
      'UPDATE customers SET loyalty_points = loyalty_points + $1, updated_at = NOW() WHERE id = $2',
      [points, id]
    );
    
    res.json({ success: true, message: 'Loyalty points added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const redeemLoyalty = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;
    
    await pool.query(
      'UPDATE customers SET loyalty_points = loyalty_points - $1, updated_at = NOW() WHERE id = $2',
      [points, id]
    );
    
    res.json({ success: true, message: 'Loyalty points redeemed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCustomers,
  searchCustomers,
  getCustomerById,
  getCustomerHistory,
  createCustomer,
  updateCustomer,
  addLoyaltyPoints,
  redeemLoyalty,
};
