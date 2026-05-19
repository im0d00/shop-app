import React, { useState } from 'react';
import { Mail, Lock, User, Store } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass rounded-2xl border border-dark-700/50 p-8 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center animate-float">
            <Store className="text-white" size={32} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">Retail OS Pro</h1>
        <p className="text-dark-400 text-center mb-8">Premium POS & Inventory System</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="admin@shop.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-dark-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded" />
            <label htmlFor="remember" className="ml-2 text-dark-400 text-sm">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-dark-400 text-center text-sm mt-6">
          Demo: admin@retailos.com / password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
