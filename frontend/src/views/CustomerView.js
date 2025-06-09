import React from 'react';
import Header from '../components/Header';
import MenuView from './MenuView';
import CartView from './CartView';
import OrdersView from './OrdersView';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

function CustomerView() {
  const { currentView, pageBackground } = useAppContext();

  return (
    <div className="relative min-h-screen w-full">
      {/* This div is for the background image. 
        The key changes are using h-screen and w-screen to force it to the full size of the browser window.
      */}
      <motion.div
        className="fixed top-0 left-0 h-screen w-screen -z-10" // <-- Use h-screen and w-screen
        style={{
          backgroundImage: `url(${pageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        key={pageBackground} // Re-triggers animation when the background image changes
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      
      {/* This div provides the dark overlay and contains all the content */}
      <div className="absolute top-0 left-0 min-h-full w-full bg-black/60">
        <Header />
        
        <main className="pt-24 pb-12">
          {currentView === 'menu' && <MenuView />}
          {currentView === 'cart' && <CartView />}
          {currentView === 'orders' && <OrdersView />}
        </main>
        
        <footer className="text-gray-300 p-2 -mt-12 text-center">
          <h3 className="text-xl font-bold">
            YOU'RE THE BEST! THANKS FOR VISITING.
          </h3>
          <p>Mamta Bhojnalaya - Serving authentic Indian cuisine with love</p>
        </footer>
      </div>
    </div>
  );
}

export default CustomerView;