import axios from 'axios';
import {
  authAPI,
  productsAPI,
  inventoryAPI,
  salesAPI,
  reportsAPI,
  customersAPI,
} from './client';

jest.mock('axios');

describe('frontend api client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'token-1');
  });

  it('authAPI.login posts credentials', () => {
    authAPI.login('a@b.com', 'pass');

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
      email: 'a@b.com',
      password: 'pass',
    });
  });

  it('authAPI.register posts payload', () => {
    const payload = { email: 'a@b.com', password: 'pass', name: 'User' };
    authAPI.register(payload);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/register', payload);
  });

  it('authAPI.activateLicense posts license key', () => {
    authAPI.activateLicense('ABC-123');

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/activate-license', {
      licenseKey: 'ABC-123',
    });
  });

  it('productsAPI.getAll sends auth header', () => {
    productsAPI.getAll();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/products', {
      headers: { Authorization: 'Bearer token-1' },
    });
  });

  it('productsAPI.update sends id, data and auth header', () => {
    const data = { name: 'P1' };
    productsAPI.update('p1', data);

    expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/api/products/p1', data, {
      headers: { Authorization: 'Bearer token-1' },
    });
  });

  it('inventoryAPI.getLowStock uses default threshold and auth header', () => {
    inventoryAPI.getLowStock();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/inventory/low-stock', {
      params: { threshold: 10 },
      headers: { Authorization: 'Bearer token-1' },
    });
  });

  it('salesAPI.getAll includes date range params and auth header', () => {
    salesAPI.getAll('2026-01-01', '2026-01-31');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/sales', {
      params: { startDate: '2026-01-01', endDate: '2026-01-31' },
      headers: { Authorization: 'Bearer token-1' },
    });
  });

  it('salesAPI.refund posts to refund endpoint', () => {
    salesAPI.refund('s1');

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/sales/s1/refund',
      {},
      { headers: { Authorization: 'Bearer token-1' } }
    );
  });

  it('reportsAPI.getBestSellers uses default limit and auth header', () => {
    reportsAPI.getBestSellers();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/reports/best-sellers', {
      params: { limit: 20 },
      headers: { Authorization: 'Bearer token-1' },
    });
  });

  it('customersAPI.search calls search endpoint with auth header', () => {
    customersAPI.search('john');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/customers/search/john', {
      headers: { Authorization: 'Bearer token-1' },
    });
  });
});
