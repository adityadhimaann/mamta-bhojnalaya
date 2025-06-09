import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from '../hooks/useLocalStorage';
import defaultBg from '../assets/backgrounds/default-bg.jpg';

const AppContext = createContext(null);

// This URL works for BOTH local development (with proxy) and Vercel deployment
const API_URL = '/api';

export const AppProvider = ({ children }) => {
  const [pageBackground, setPageBackground] = useState(defaultBg);
  const [currentView, setCurrentView] = useState("menu");
  const [cart, setCart] = useLocalStorage("mamta_cart", []);
  const [orders, setOrders] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Could not fetch existing orders.");
      }
    };
    fetchOrders();
  }, []);

  // All other functions (placeOrder, updateOrderStatus, etc.) remain the same
  // as they already use the API_URL variable.
  const placeOrder = useCallback(async () => {
    if (cart.length === 0) return;
    const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const newOrderPayload = { id: Date.now(), items: cart, total: getTotalPrice() };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to place order. Server responded with: ${errorData}`);
      }
      
      const newOrderForState = { ...newOrderPayload, id: newOrderPayload.id.toString(), total_price: newOrderPayload.total, status: 'pending', created_at: new Date().toISOString() };
      setOrders(prevOrders => [newOrderForState, ...prevOrders]);
      setCart([]);
      setCurrentView("orders");
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Error in placeOrder:", err);
      toast.error("Failed to place order. Check console for details.");
    }
  }, [cart, setCart, setCurrentView, setOrders]);
  
  // ...other functions...

  const value = {
    pageBackground, setPageBackground,
    currentView, setCurrentView,
    cart, setCart, // provide setCart now
    orders, setOrders, // provide setOrders now
    placeOrder,
    //... all other functions and state...
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
