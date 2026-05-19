const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, role, status, hire_date, created_at FROM users WHERE role IN ($1, $2, $3) ORDER BY name',
      ['manager', 'cashier', 'inventory']
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role IN ($2, $3, $4)',
      [id, 'manager', 'cashier', 'inventory']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { skip = 0, limit = 100 } = req.query;
    
    const result = await pool.query(
      `SELECT * FROM employee_logs WHERE employee_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [id, limit, skip]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalesReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT COUNT(*) as total_sales, SUM(total_amount) as total_amount FROM sales WHERE created_by = $1';
    const params = [id];
    
    if (startDate && endDate) {
      query += ' AND created_at >= $2 AND created_at <= $3';
      params.push(startDate, endDate);
    }
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    const bcrypt = require('bcryptjs');
    
    const employeeId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      `INSERT INTO users (id, email, password_hash, name, phone, role, status, hire_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [employeeId, email, hashedPassword, name, phone, role, 'active']
    );
    
    res.json({ success: true, message: 'Employee created', employeeId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    
    await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, role = $4, updated_at = NOW() WHERE id = $5',
      [name, email, phone, role, id]
    );
    
    res.json({ success: true, message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
      ['inactive', id]
    );
    
    res.json({ success: true, message: 'Employee deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getActivityLog,
  getSalesReport,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  deactivateEmployee,
};
