import React from 'react';
import { Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const OrdersView = () => {
  const { orders, isAdmin, updateOrderStatus } = useAppContext();

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <Clock size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">No Past Orders</h2>
          <p className="text-gray-500 mt-2">Your recent orders will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-amber-600 mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h3 className="text-xl font-bold">Order #{order.id}</h3>
                <p className="text-gray-500 text-sm">{order.timestamp}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : order.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mb-4 border-t pt-4">
                <span className="font-semibold">Admin:</span>
                <button onClick={() => updateOrderStatus(order.id, "preparing")} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Mark as Preparing</button>
                <button onClick={() => updateOrderStatus(order.id, "ready")} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Mark as Ready</button>
              </div>
            )}
            <div className="space-y-2 mb-4 border-t pt-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>{item.name} ({item.size}) x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersView;