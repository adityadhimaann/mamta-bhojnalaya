import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import SalesReport from '../components/SalesReport';

const AdminView = () => {
  const { orders, updateOrderStatus } = useAppContext();
  const notificationSoundRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const playSound = () => {
      notificationSoundRef.current?.play().catch(error => {
        console.log("Audio playback failed. User interaction may be required.", error);
      });
    };
    window.addEventListener('newOrder', playSound);
    return () => {
      window.removeEventListener('newOrder', playSound);
    };
  }, []);

  const validOrders = Array.isArray(orders) ? orders : [];
  const activeOrders = [...validOrders].reverse().filter(o => o.status !== 'completed');
  const pendingOrders = activeOrders.filter(o => o.status === 'pending');
  const preparingOrders = activeOrders.filter(o => o.status === 'preparing');
  const readyOrders = activeOrders.filter(o => o.status === 'ready');

  const OrderCard = ({ order }) => (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-full hover:shadow-xl transition-shadow">
      <div className="border-b pb-2 mb-2 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${
          order.status === 'pending' ? 'bg-red-500' :
          order.status === 'preparing' ? 'bg-blue-500' : 'bg-green-500'
        }`}>
          {order.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{order.timestamp}</p>
      
      <div className="space-y-1 flex-grow mb-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.name} ({item.size})</span>
            <span className="font-medium">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 mt-2">
        <p className="text-right font-bold text-lg text-gray-900">Total: ₹{order.total}</p>
      </div>
      <div className="flex gap-2 mt-4">
        {order.status === 'pending' && (
          <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold">Start Preparing</button>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">Mark as Ready</button>
        )}
        {order.status === 'ready' && (
           <button onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold">Complete Order</button>
        )}
      </div>
    </div>
  );

  const OrderColumn = ({ title, orders, className }) => (
    <div className={`flex-1 p-4 rounded-xl min-w-[320px] ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4 sticky top-20 backdrop-blur-sm py-2 px-1 rounded">
        {title} <span className="text-base font-normal opacity-80">({orders.length})</span>
      </h2>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="text-center py-16 px-4 border-2 border-dashed border-white border-opacity-30 rounded-lg h-full flex items-center justify-center">
            <p className="text-white opacity-70">No orders in this category.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <audio ref={notificationSoundRef} src="/notification.mp3" preload="auto"></audio>

      <header className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/" className="text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors">
            Go to Customer View
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'orders' ? 'border-b-2 border-amber-400 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Live Orders
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'reports' ? 'border-b-2 border-amber-400 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sales Report
          </button>
        </div>

        {activeTab === 'orders' && (
          // --- FIX: This class provides a better responsive flex layout ---
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <OrderColumn title="Pending" orders={pendingOrders} className="bg-red-900 bg-opacity-40" />
            <OrderColumn title="Preparing" orders={preparingOrders} className="bg-blue-900 bg-opacity-40" />
            <OrderColumn title="Ready for Pickup" orders={readyOrders} className="bg-green-900 bg-opacity-40" />
          </div>
        )}
        
        {activeTab === 'reports' && (
          <SalesReport orders={orders} />
        )}
      </main>
    </div>
  );
};

export default AdminView;