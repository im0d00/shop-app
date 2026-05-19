import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ token, user, isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (email, password, name, shopName) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_BASE}/auth/register`, { email, password, name, shop_name: shopName });
      set({ isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  activateLicense: async (licenseKey) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_BASE}/auth/activate-license`, { licenseKey });
      set({ isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'License activation failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },
}));
