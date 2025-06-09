import React from 'react';
import { Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddToCartButton = ({ onClick, isAdded, size, price }) => {
  // Animation variants for the text content inside the button
  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isAdded}
      // Add hover and tap animations for a tactile feel
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Use dynamic gradients for a more premium look
      className={`relative flex items-center justify-center h-9 min-w-[112px] px-4 rounded-full 
                 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300
                 overflow-hidden ${isAdded
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                 }`}
    >
      {/* AnimatePresence handles the animation when content changes */}
      <AnimatePresence mode="popLayout" initial={false}>
        {isAdded ? (
          // --- "Added" state with checkmark ---
          <motion.span
            key="added"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-1"
          >
            <Check size={16} strokeWidth={3} /> Added
          </motion.span>
        ) : (
          // --- Default "Add" state with plus icon ---
          <motion.span
            key="add"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-1"
          >
            <Plus size={14} strokeWidth={3} />
            {size ? `${size} ₹${price}` : `₹${price}`}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToCartButton;