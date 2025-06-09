import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AddToCartButton from './AddToCartButton';
import { motion } from 'framer-motion'; // Import motion

const MenuSection = React.memo(({ title, items, Icon }) => {
  const { addToCart } = useAppContext();
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const handleAddToCart = (item, size, price) => {
    addToCart(item, size, price);
    const uniqueId = `${item.name}-${size}`;
    setRecentlyAdded(uniqueId);
    setTimeout(() => {
      setRecentlyAdded(null);
    }, 1500);
  };

  // --- ANIMATION: Variants for the container to stagger children ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
      },
    },
  };

  // --- ANIMATION: Variants for each menu item ---
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    // --- ANIMATION: Section fades/slides in when it enters the view ---
    <motion.div
      className="bg-white rounded-2xl shadow-xl shadow-amber-600/10 p-6 mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of it is visible
      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
    >
      <div className="flex items-center gap-4 mb-4 border-b-2 border-amber-200 pb-3">
        {/* --- NEW: Icon for the section title --- */}
        {Icon && <Icon className="text-amber-500" size={32} />}
        <h3 className="text-3xl font-bold text-amber-600 tracking-wide">
          {title}
        </h3>
      </div>
      
      {/* --- ANIMATION: This container will stagger its children's animations --- */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          // --- ANIMATION: Each item will animate in based on itemVariants ---
          <motion.div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0px 10px 20px rgba(0,0,0,0.05)' }}
          >
            <span className="font-semibold text-lg text-gray-800 mb-2 sm:mb-0">
              {item.name}
            </span>
            <div className="flex gap-2 flex-wrap">
              {item.half && (
                <AddToCartButton
                  onClick={() => handleAddToCart(item, "Half", item.half)}
                  isAdded={recentlyAdded === `${item.name}-Half`}
                  size="Half"
                  price={item.half}
                  className={recentlyAdded === `${item.name}-Half` ? "bg-green-500" : "bg-amber-500 hover:bg-amber-600"}
                />
              )}
              {item.full && (
                <AddToCartButton
                  onClick={() => handleAddToCart(item, "Full", item.full)}
                  isAdded={recentlyAdded === `${item.name}-Full`}
                  size="Full"
                  price={item.full}
                  className={recentlyAdded === `${item.name}-Full` ? "bg-green-500" : "bg-amber-600 hover:bg-amber-700"}
                />
              )}
              {item.price && (
                <AddToCartButton
                  onClick={() => handleAddToCart(item, "Regular", item.price)}
                  isAdded={recentlyAdded === `${item.name}-Regular`}
                  size="Regular"
                  price={item.price}
                  className={recentlyAdded === `${item.name}-Regular` ? "bg-green-500" : "bg-amber-500 hover:bg-amber-600"}
                />
              )}
              {item.small && (
                 <AddToCartButton
                    onClick={() => handleAddToCart(item, "Small", item.small)}
                    isAdded={recentlyAdded === `${item.name}-Small`}
                    size="Small"
                    price={item.small}
                    className={recentlyAdded === `${item.name}-Small` ? "bg-green-500" : "bg-amber-500 hover:bg-amber-600"}
                  />
              )}
               {item.large && (
                 <AddToCartButton
                    onClick={() => handleAddToCart(item, "Large", item.large)}
                    isAdded={recentlyAdded === `${item.name}-Large`}
                    size="Large"
                    price={item.large}
                    className={recentlyAdded === `${item.name}-Large` ? "bg-green-500" : "bg-amber-600 hover:bg-amber-700"}
                  />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
});

export default MenuSection;