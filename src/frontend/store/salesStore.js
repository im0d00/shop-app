import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const useSalesStore = create((set) => ({
  sales: [],
  currentSale: null,
  cartItems: [],
  isLoading: false,
  error: null,

  getSales: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/sales`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ sales: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createSale: async (saleData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/sales`, saleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addToCart: (item) => {
    set((state) => {
      const existing = state.cartItems.find((i) => i.variantId === item.variantId);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cartItems: [...state.cartItems, item] };
    });
  },

  removeFromCart: (variantId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.variantId !== variantId),
    }));
  },

  clearCart: () => {
    set({ cartItems: [] });
  },
}));
