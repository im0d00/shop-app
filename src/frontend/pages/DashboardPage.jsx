import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, AlertCircle, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSalesStore } from '../store/salesStore';
import { salesAPI } from '../api/client';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dailyData, monthlyData] = await Promise.all([
        salesAPI.getDailySales(),
        salesAPI.getMonthlySales(),
      ]);

      // Calculate stats
      const totalRevenue = dailyData.data.data.reduce((sum, item) => sum + (item.total || 0), 0);
      const totalSales = dailyData.data.data.reduce((sum, item) => sum + (item.count || 0), 0);
      const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      setStats({
        totalSales,
        totalRevenue,
        totalCustomers: 0, // Fetch from API
        averageOrderValue: avgOrderValue,
      });

      setChartData(monthlyData.data.data || []);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change }) => (
    <div className="glass rounded-xl p-6 border border-dark-700/50 hover:border-neon-blue/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {change && <p className="text-neon-green text-sm mt-1">+{change}%</p>}
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
          <Icon className="text-neon-blue" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-dark-400">Welcome to your retail operating system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} change={12} />
        <StatCard icon={ShoppingCart} label="Total Sales" value={stats.totalSales} change={8} />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} change={5} />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={`$${stats.averageOrderValue.toFixed(2)}`} change={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass rounded-xl p-6 border border-dark-700/50">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Area type="monotone" dataKey="total" stroke="#00d9ff" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Trend */}
        <div className="glass rounded-xl p-6 border border-dark-700/50">
          <h2 className="text-lg font-bold text-white mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="glass rounded-xl p-6 border border-dark-700/50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-neon-pink" size={24} />
            <h2 className="text-lg font-bold text-white">Low Stock Alerts</h2>
          </div>
          <div className="space-y-2">
            {['Black Shirt - S', 'Blue Jeans - M', 'White Socks - L'].map((item) => (
              <div key={item} className="flex items-center justify-between p-2 rounded-lg bg-dark-700/30">
                <span className="text-dark-300">{item}</span>
                <span className="text-neon-pink font-semibold">5 units</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-6 border border-dark-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-neon-green" size={24} />
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-2">
            {['Sale completed: $450', 'New customer added', 'Inventory updated'].map((activity) => (
              <div key={activity} className="flex items-center gap-2 p-2 rounded-lg bg-dark-700/30">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-dark-300 text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
