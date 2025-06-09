import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';

const CartView = () => {
  const { cart, updateQuantity, getTotalPrice, placeOrder, setCurrentView } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaceOrder = () => {
    placeOrder();
    setIsModalOpen(false);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => setCurrentView("menu")} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-amber-600 mb-6">Your Shopping Cart</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b">
                <div>
                  <h4 className="font-medium text-lg">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.size} - ₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200">
                    <Minus size={16} />
                  </button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="bg-green-100 text-green-600 p-1 rounded-full hover:bg-green-200">
                    <Plus size={16} />
                  </button>
                  <span className="ml-4 font-bold text-lg w-20 text-right">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-end items-center mb-4">
              <span className="text-xl font-bold">Total: ₹{getTotalPrice()}</span>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold text-lg">
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handlePlaceOrder} title="Confirm Your Order">
        <p>Are you sure you want to place this order for a total of <strong>₹{getTotalPrice()}</strong>?</p>
      </Modal>
    </>
  );
};

export default CartView;