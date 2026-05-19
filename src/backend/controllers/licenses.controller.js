const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const getLicenseStatus = (req, res) => {
  try {
    // Get license from local storage or file
    res.json({
      success: true,
      data: {
        status: 'active',
        activatedDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isValid: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const activateLicense = (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ success: false, message: 'License key required' });
    }

    // Validate license key
    const isValid = validateLicenseKey(licenseKey);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid license key' });
    }

    // Store license locally
    res.json({
      success: true,
      message: 'License activated successfully',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const renewLicense = (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ success: false, message: 'License key required' });
    }

    res.json({
      success: true,
      message: 'License renewed successfully',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLicenseInfo = (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        productName: process.env.APP_NAME,
        version: process.env.APP_VERSION,
        licenseType: 'yearly',
        licensedTo: 'Your Shop Name',
        activatedDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        daysRemaining: 365,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateLicense = (req, res) => {
  try {
    res.json({
      success: true,
      isValid: true,
      message: 'License is valid',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateLicenseKey = (key) => {
  // Implement license key validation logic
  return key && key.length > 0;
};

module.exports = {
  getLicenseStatus,
  activateLicense,
  renewLicense,
  getLicenseInfo,
  validateLicense,
};
