import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AddToCartButton from './AddToCartButton'; // We still need this for the buttons

const AccordionSection = ({
  title,
  items,
  Icon,
  isOpen,
  onToggle,
  recentlyAdded,
  handleAddToCart,
}) => {
  // Animation for the content panel to slide down/up
  const panelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  // Staggered animation for the items within the panel
  const listVariants = {
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="border-b border-gray-200 overflow-hidden">
      <motion.button
        className={`w-full flex justify-between items-center p-5 text-left ${isOpen ? 'bg-amber-100' : 'bg-white hover:bg-amber-50'}`}
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <div className="flex items-center gap-4">
          {Icon && <Icon className="text-amber-600" size={28} />}
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="text-amber-600" size={24} />
        </motion.div>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white"
          >
            <motion.div
              className="p-5 space-y-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3"
                >
                  <span className="font-medium text-lg text-gray-700 mb-2 sm:mb-0">
                    {item.name}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {/* Reusing the AddToCartButton with logic passed down */}
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
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionSection;