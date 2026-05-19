import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const useProductStore = create((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  getProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ products: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchProducts: async (query) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/products/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ products: response.data.data });
    } catch (error) {
      console.error('Search error:', error);
    }
  },

  getProductById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentProduct: response.data.data });
      return response.data.data;
    } catch (error) {
      console.error('Fetch product error:', error);
    }
  },

  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
