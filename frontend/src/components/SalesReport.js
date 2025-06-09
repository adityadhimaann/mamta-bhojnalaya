import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesReport = ({ orders }) => {

  // useMemo will re-calculate the report data only when the 'orders' prop changes.
  const reportData = useMemo(() => {
    // We only want to generate reports on orders that have been paid for and completed.
    const completedOrders = orders.filter(o => o.status === 'completed');

    if (completedOrders.length === 0) {
      return null;
    }

    // --- Metric 1: Total Revenue & Sales over Time ---
    const salesOverTime = completedOrders.reduce((acc, order) => {
      const date = new Date(order.id).toLocaleDateString('en-IN'); // Group sales by day
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    const chartSalesData = Object.keys(salesOverTime).map(date => ({
      name: date,
      Sales: salesOverTime[date],
    })).sort((a, b) => new Date(a.name.split('/').reverse().join('-')) - new Date(b.name.split('/').reverse().join('-')));
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    // --- Metric 2: Most Popular Items ---
    const itemCounts = completedOrders.flatMap(o => o.items).reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {});
    
    const popularItemsData = Object.keys(itemCounts).map(name => ({
      name,
      Quantity: itemCounts[name],
    })).sort((a, b) => b.Quantity - a.Quantity).slice(0, 10); // Top 10 items

    return {
      totalRevenue,
      totalCompletedOrders: completedOrders.length,
      averageOrderValue: totalRevenue / completedOrders.length,
      chartSalesData,
      popularItemsData
    };
  }, [orders]);

  if (!reportData) {
    return (
      <div className="text-center p-10 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold text-white">No Sales Data Available</h2>
        <p className="text-gray-400 mt-2">Complete some orders to generate a sales report.</p>
      </div>
    );
  }

  const StatCard = ({ title, value, prefix = '' }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{prefix}{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={reportData.totalRevenue.toLocaleString('en-IN')} prefix="₹" />
        <StatCard title="Completed Orders" value={reportData.totalCompletedOrders} />
        <StatCard title="Average Order Value" value={reportData.averageOrderValue.toFixed(2)} prefix="₹" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Over Time Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-white mb-4 text-lg">Sales Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.chartSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" tickFormatter={(value) => `₹${value}`} />
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
              <Legend />
              <Line type="monotone" dataKey="Sales" stroke="#FBBF24" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Items Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-white mb-4 text-lg">Top 10 Popular Items</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.popularItemsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis type="number" stroke="#A0AEC0" />
              <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={120} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
              <Legend />
              <Bar dataKey="Quantity" fill="#FBBF24" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;