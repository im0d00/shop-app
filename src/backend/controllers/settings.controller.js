const pool = require('../config/database');

const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM app_settings ORDER BY key'
    );
    
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO app_settings (key, value) VALUES ($1, $2) 
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, JSON.stringify(value)]
      );
    }
    
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrinterConfig = async (req, res) => {
  try {
    const { printerName, paperWidth, paperHeight } = req.body;
    
    await pool.query(
      `INSERT INTO app_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
      ['printer_config', JSON.stringify({ printerName, paperWidth, paperHeight })]
    );
    
    res.json({ success: true, message: 'Printer configuration updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTaxConfig = async (req, res) => {
  try {
    const { taxRate, taxLabel } = req.body;
    
    await pool.query(
      `INSERT INTO app_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
      ['tax_config', JSON.stringify({ taxRate, taxLabel })]
    );
    
    res.json({ success: true, message: 'Tax configuration updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSystemInfo = (req, res) => {
  try {
    const os = require('os');
    
    res.json({
      success: true,
      data: {
        appName: process.env.APP_NAME,
        appVersion: process.env.APP_VERSION,
        buildNumber: process.env.BUILD_NUMBER,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: os.platform(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updatePrinterConfig,
  updateTaxConfig,
  getSystemInfo,
};
