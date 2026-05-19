import axios from 'axios';
import { useSalesStore } from './salesStore';

jest.mock('axios');

const resetStore = () => {
  useSalesStore.setState({
    sales: [],
    currentSale: null,
    cartItems: [],
    isLoading: false,
    error: null,
  });
};

describe('salesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    resetStore();
  });

  it('getSales loads sales data successfully', async () => {
    localStorage.setItem('token', 'token-1');
    axios.get.mockResolvedValue({ data: { data: [{ id: 's1' }] } });

    await useSalesStore.getState().getSales('2026-01-01', '2026-01-31');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/sales', {
      params: { startDate: '2026-01-01', endDate: '2026-01-31' },
      headers: { Authorization: 'Bearer token-1' },
    });
    expect(useSalesStore.getState().sales).toEqual([{ id: 's1' }]);
    expect(useSalesStore.getState().isLoading).toBe(false);
    expect(useSalesStore.getState().error).toBeNull();
  });

  it('getSales stores error state on failure', async () => {
    axios.get.mockRejectedValue(new Error('network error'));

    await useSalesStore.getState().getSales('2026-01-01', '2026-01-31');

    expect(useSalesStore.getState().isLoading).toBe(false);
    expect(useSalesStore.getState().error).toBe('network error');
  });

  it('createSale returns response data on success', async () => {
    localStorage.setItem('token', 'token-1');
    axios.post.mockResolvedValue({ data: { id: 'sale-1', total: 99 } });

    const result = await useSalesStore.getState().createSale({ items: [{ variantId: 'v1' }] });

    expect(result).toEqual({ id: 'sale-1', total: 99 });
    expect(useSalesStore.getState().isLoading).toBe(false);
    expect(useSalesStore.getState().error).toBeNull();
  });

  it('createSale sets error and rethrows on failure', async () => {
    const error = new Error('create failed');
    axios.post.mockRejectedValue(error);

    await expect(useSalesStore.getState().createSale({ items: [] })).rejects.toThrow('create failed');
    expect(useSalesStore.getState().isLoading).toBe(false);
    expect(useSalesStore.getState().error).toBe('create failed');
  });

  it('addToCart adds new items and merges existing quantities', () => {
    const { addToCart } = useSalesStore.getState();

    addToCart({ variantId: 'v1', quantity: 1, price: 10 });
    addToCart({ variantId: 'v1', quantity: 2, price: 10 });

    expect(useSalesStore.getState().cartItems).toEqual([{ variantId: 'v1', quantity: 3, price: 10 }]);
  });

  it('removeFromCart removes item by variantId', () => {
    useSalesStore.setState({
      cartItems: [
        { variantId: 'v1', quantity: 1 },
        { variantId: 'v2', quantity: 2 },
      ],
    });

    useSalesStore.getState().removeFromCart('v1');

    expect(useSalesStore.getState().cartItems).toEqual([{ variantId: 'v2', quantity: 2 }]);
  });

  it('clearCart clears all items', () => {
    useSalesStore.setState({ cartItems: [{ variantId: 'v1', quantity: 1 }] });

    useSalesStore.getState().clearCart();

    expect(useSalesStore.getState().cartItems).toEqual([]);
  });
});
