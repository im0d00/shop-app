import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const authAPI = {
  login: (email, password) =>
    axios.post(`${API_BASE}/auth/login`, { email, password }),
  register: (data) =>
    axios.post(`${API_BASE}/auth/register`, data),
  activateLicense: (licenseKey) =>
    axios.post(`${API_BASE}/auth/activate-license`, { licenseKey }),
};

export const productsAPI = {
  getAll: () =>
    axios.get(`${API_BASE}/products`, { headers: getAuthHeader() }),
  getById: (id) =>
    axios.get(`${API_BASE}/products/${id}`, { headers: getAuthHeader() }),
  search: (query) =>
    axios.get(`${API_BASE}/products/search/${query}`, { headers: getAuthHeader() }),
  create: (data) =>
    axios.post(`${API_BASE}/products`, data, { headers: getAuthHeader() }),
  update: (id, data) =>
    axios.put(`${API_BASE}/products/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) =>
    axios.delete(`${API_BASE}/products/${id}`, { headers: getAuthHeader() }),
};

export const inventoryAPI = {
  getInventory: () =>
    axios.get(`${API_BASE}/inventory`, { headers: getAuthHeader() }),
  getLowStock: (threshold = 10) =>
    axios.get(`${API_BASE}/inventory/low-stock`, {
      params: { threshold },
      headers: getAuthHeader(),
    }),
  updateStock: (id, quantity, reason) =>
    axios.put(`${API_BASE}/inventory/${id}/update-stock`, { quantity, reason }, { headers: getAuthHeader() }),
  getHistory: () =>
    axios.get(`${API_BASE}/inventory/history`, { headers: getAuthHeader() }),
  getAnalytics: () =>
    axios.get(`${API_BASE}/inventory/analytics`, { headers: getAuthHeader() }),
};

export const salesAPI = {
  getAll: (startDate, endDate) =>
    axios.get(`${API_BASE}/sales`, {
      params: { startDate, endDate },
      headers: getAuthHeader(),
    }),
  getById: (id) =>
    axios.get(`${API_BASE}/sales/${id}`, { headers: getAuthHeader() }),
  create: (data) =>
    axios.post(`${API_BASE}/sales`, data, { headers: getAuthHeader() }),
  refund: (id) =>
    axios.post(`${API_BASE}/sales/${id}/refund`, {}, { headers: getAuthHeader() }),
  getDailySales: () =>
    axios.get(`${API_BASE}/sales/analytics/daily`, { headers: getAuthHeader() }),
  getMonthlySales: () =>
    axios.get(`${API_BASE}/sales/analytics/monthly`, { headers: getAuthHeader() }),
};

export const reportsAPI = {
  getDailyReport: (date) =>
    axios.get(`${API_BASE}/reports/daily`, {
      params: { date },
      headers: getAuthHeader(),
    }),
  getWeeklyReport: () =>
    axios.get(`${API_BASE}/reports/weekly`, { headers: getAuthHeader() }),
  getMonthlyReport: (month, year) =>
    axios.get(`${API_BASE}/reports/monthly`, {
      params: { month, year },
      headers: getAuthHeader(),
    }),
  getProfitLoss: (startDate, endDate) =>
    axios.get(`${API_BASE}/reports/profit-loss`, {
      params: { startDate, endDate },
      headers: getAuthHeader(),
    }),
  getBestSellers: (limit = 20) =>
    axios.get(`${API_BASE}/reports/best-sellers`, {
      params: { limit },
      headers: getAuthHeader(),
    }),
};

export const customersAPI = {
  getAll: () =>
    axios.get(`${API_BASE}/customers`, { headers: getAuthHeader() }),
  getById: (id) =>
    axios.get(`${API_BASE}/customers/${id}`, { headers: getAuthHeader() }),
  search: (query) =>
    axios.get(`${API_BASE}/customers/search/${query}`, { headers: getAuthHeader() }),
  create: (data) =>
    axios.post(`${API_BASE}/customers`, data, { headers: getAuthHeader() }),
  update: (id, data) =>
    axios.put(`${API_BASE}/customers/${id}`, data, { headers: getAuthHeader() }),
};
