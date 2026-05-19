const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, shop_name, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, email, name, shop_name, role, status, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const bcrypt = require('bcryptjs');
    
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'INSERT INTO users (id, email, password_hash, name, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, email, hashedPassword, name, role, 'active']
    );
    
    res.json({ success: true, message: 'User created', userId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    await pool.query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3',
      [name, email, id]
    );
    
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    await pool.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
      [role, id]
    );
    
    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
};
