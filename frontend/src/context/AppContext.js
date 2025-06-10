import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from '../hooks/useLocalStorage';
import defaultBg from '../assets/backgrounds/default-bg.jpg';

const AppContext = createContext(null);
const API_URL = '/api'; // This relative URL works for both local and Vercel deployment

export const AppProvider = ({ children }) => {
  const [pageBackground, setPageBackground] = useState(defaultBg);
  const [currentView, setCurrentView] = useState("menu");
  const [cart, setCart] = useLocalStorage("mamta_cart", []);
  const [orders, setOrders] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch initial orders on app load
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

  // Real-time listener for orders from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'mamta_orders' && e.newValue) {
        const newOrders = JSON.parse(e.newValue);
        if (newOrders.length > orders.length) {
          window.dispatchEvent(new Event('newOrder'));
          toast.success("A new order has arrived!", { icon: '🔔' });
        }
        setOrders(newOrders);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [orders.length]);

  // Function to add items to the cart
  const addToCart = useCallback((item, size, price) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.name === item.name && cartItem.size === size
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        const newItem = {
          id: `${item.name}-${size}-${Date.now()}`,
          name: item.name,
          size: size,
          price: price,
          quantity: 1,
        };
        return [...prevCart, newItem];
      }
    });
    toast.success(`${item.name} (${size}) added to cart!`);
  }, [setCart]);

  const updateQuantity = useCallback((id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      ).filter((item) => item.quantity > 0)
    );
  }, [cart, setCart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const placeOrder = useCallback(async () => {
    if (cart.length === 0) return;

    const newOrderPayload = {
      id: Date.now(),
      items: cart,
      total: getTotalPrice(),
    };

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

      const newOrderForState = {
        ...newOrderPayload,
        id: newOrderPayload.id.toString(),
        total_price: newOrderPayload.total,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      setOrders(prevOrders => [newOrderForState, ...prevOrders]);
      setCart([]);
      setCurrentView("orders");
      toast.success("Order placed successfully!");

    } catch (err) {
      console.error("Error in placeOrder:", err);
      toast.error("Failed to place order. Check console for details.");
    }
  }, [cart, getTotalPrice, setCart, setCurrentView, setOrders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        setOrders(prevOrders =>
            prevOrders.map(order =>
                String(order.id) === String(orderId) ? { ...order, status } : order
            )
        );
        toast.success(`Order status updated to ${status}.`);
    } catch (err) {
        console.error("Error in updateOrderStatus:", err);
        toast.error("Failed to update order status.");
    }
  }, [setOrders]);

  const value = {
    pageBackground, setPageBackground,
    currentView, setCurrentView,
    cart, addToCart, updateQuantity, getTotalPrice, placeOrder,
    orders, updateOrderStatus,
    showMobileMenu, setShowMobileMenu,
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