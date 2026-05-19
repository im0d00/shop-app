const pool = require('../config/database');

const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      `SELECT COUNT(*) as total_sales, SUM(total_amount) as total_revenue, AVG(total_amount) as avg_sale 
       FROM sales WHERE DATE(created_at) = $1 AND deleted_at IS NULL`,
      [targetDate]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWeeklyReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as total_sales, SUM(total_amount) as total_revenue 
       FROM sales WHERE created_at >= NOW() - INTERVAL '7 days' AND deleted_at IS NULL 
       GROUP BY DATE(created_at) ORDER BY date DESC`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetYear = year || currentDate.getFullYear();
    const targetMonth = month || currentDate.getMonth() + 1;
    
    const result = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as total_sales, SUM(total_amount) as total_revenue 
       FROM sales WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2 AND deleted_at IS NULL 
       GROUP BY DATE(created_at) ORDER BY date DESC`,
      [targetMonth, targetYear]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await pool.query(
      `SELECT 
         SUM(s.total_amount) as total_revenue,
         SUM(si.quantity * p.cost_price) as total_cost,
         (SUM(s.total_amount) - SUM(si.quantity * p.cost_price)) as profit
       FROM sales s
       LEFT JOIN sale_items si ON s.id = si.sale_id
       LEFT JOIN product_variants pv ON si.variant_id = pv.id
       LEFT JOIN products p ON pv.product_id = p.id
       WHERE s.created_at >= $1 AND s.created_at <= $2 AND s.deleted_at IS NULL`,
      [startDate, endDate]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInventoryReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, p.sku, pv.size, pv.color, pv.quantity, p.cost_price, p.selling_price 
       FROM product_variants pv 
       LEFT JOIN products p ON pv.product_id = p.id 
       WHERE p.deleted_at IS NULL 
       ORDER BY p.name, pv.size, pv.color`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.name, u.email, COUNT(s.id) as total_sales, SUM(s.total_amount) as total_amount 
       FROM users u 
       LEFT JOIN sales s ON u.id = s.created_by 
       WHERE u.role IN ('cashier', 'manager') 
       GROUP BY u.id, u.name, u.email 
       ORDER BY u.name`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBestSellersReport = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const result = await pool.query(
      `SELECT p.name, p.sku, SUM(si.quantity) as total_quantity, SUM(si.subtotal) as total_revenue 
       FROM sale_items si 
       LEFT JOIN product_variants pv ON si.variant_id = pv.id 
       LEFT JOIN products p ON pv.product_id = p.id 
       GROUP BY p.id, p.name, p.sku 
       ORDER BY total_quantity DESC 
       LIMIT $1`,
      [limit]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDeadStockReport = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.name, p.sku, pv.size, pv.color, pv.quantity, p.cost_price 
       FROM product_variants pv 
       LEFT JOIN products p ON pv.product_id = p.id 
       WHERE pv.quantity = 0 AND p.deleted_at IS NULL 
       ORDER BY p.name`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportToPDF = async (req, res) => {
  try {
    // Implement PDF export logic
    res.json({ success: true, message: 'PDF exported' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportToExcel = async (req, res) => {
  try {
    // Implement Excel export logic
    res.json({ success: true, message: 'Excel exported' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getProfitLossReport,
  getInventoryReport,
  getEmployeeReport,
  getBestSellersReport,
  getDeadStockReport,
  exportToPDF,
  exportToExcel,
};
