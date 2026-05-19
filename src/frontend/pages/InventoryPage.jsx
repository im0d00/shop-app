import React, { useEffect, useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { useProductStore } from '../store/productStore';

function InventoryPage() {
  const { products, getProducts, searchProducts, isLoading } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchProducts(query);
    } else {
      getProducts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-dark-400">Manage your product stock and variants</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 border border-dark-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <select className="input-field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="shirts">Shirts</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-xl border border-dark-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-700/50 border-b border-dark-700">
                <th className="px-6 py-4 text-left text-dark-300 font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-dark-300 font-semibold">SKU</th>
                <th className="px-6 py-4 text-left text-dark-300 font-semibold">Category</th>
                <th className="px-6 py-4 text-right text-dark-300 font-semibold">Stock</th>
                <th className="px-6 py-4 text-right text-dark-300 font-semibold">Price</th>
                <th className="px-6 py-4 text-center text-dark-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-dark-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-dark-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-dark-700 hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-dark-400 text-sm">{product.brand}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-300">{product.sku}</td>
                    <td className="px-6 py-4 text-dark-300">{product.category_id}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-sm font-semibold">12</span>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold">${product.selling_price}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-neon-blue hover:text-neon-cyan text-sm font-semibold">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
