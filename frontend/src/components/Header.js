import React, { useState, useEffect } from 'react';
// --- NEW: Imported Shield icon for the admin link ---
import { ShoppingCart, Menu, UtensilsCrossed, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { currentView, setCurrentView, cart, showMobileMenu, setShowMobileMenu } = useAppContext();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view) => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  const NavItem = ({ view, children }) => {
    const isActive = currentView === view;
    return (
      <motion.button
        onClick={() => handleNav(view)}
        className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
          isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
            layoutId="underline"
          />
        )}
      </motion.button>
    );
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 20 } },
    exit: { scale: 0, opacity: 0 }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-900/80 backdrop-blur-lg shadow-xl shadow-black/20 border-b border-gray-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: -15, scale: 1.2 }}>
              <UtensilsCrossed className="text-white group-hover:text-amber-400 transition-colors" size={32} />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors">
              Mamta Bhojnalaya
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <NavItem view="menu">Menu</NavItem>
            <NavItem view="orders">Orders</NavItem>
            <div className="relative">
              <NavItem view="cart">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} /> Cart
                </div>
              </NavItem>
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    key={cartItemCount}
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            {/* --- NEW: Link to the Admin Panel --- */}
           

          </nav>

          <button className="md:hidden text-white" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu size={28} />
          </button>
        </div>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.nav
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden mt-4 space-y-2 bg-gray-800/90 backdrop-blur-md p-4 rounded-lg border border-gray-700"
            >
              <button onClick={() => handleNav("menu")} className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded">Menu</button>
              <button onClick={() => handleNav("orders")} className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded">Orders</button>
              <button onClick={() => handleNav("cart")} className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded">Cart ({cartItemCount})</button>
              
              {/* --- NEW: Link to Admin Panel in mobile menu --- */}
              <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-2 w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded">
                <Shield size={20} /> Admin Panel
              </Link>

            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;