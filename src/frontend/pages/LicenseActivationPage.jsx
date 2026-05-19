import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function LicenseActivationPage() {
  const navigate = useNavigate();
  const { activateLicense, isLoading, error } = useAuthStore();
  const [licenseKey, setLicenseKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await activateLicense(licenseKey);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass rounded-2xl border border-dark-700/50 p-8 backdrop-blur-xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-cyan rounded-xl flex items-center justify-center">
            <Key className="text-white" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">License Activation</h1>
        <p className="text-dark-400 text-center mb-8">Enter your license key to activate</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">License Key</label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="input-field font-mono text-center tracking-widest"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 font-semibold mt-6">
            {isLoading ? 'Activating...' : 'Activate License'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-3 btn-secondary py-3 font-semibold"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default LicenseActivationPage;
