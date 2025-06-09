import React, { useState } from 'react';
import { menuData } from '../data/menuData';
import { useAppContext } from '../context/AppContext';
import AccordionSection from '../components/AccordionSection';

import defaultBg from '../assets/backgrounds/default-bg.jpg';
import paneerBg from '../assets/backgrounds/paneer-bg.jpg';
import dalBg from '../assets/backgrounds/dal-bg.jpg';
import riceBg from '../assets/backgrounds/rice-bg.jpg';
import sabjiBg from '../assets/backgrounds/sabji-bg.jpg';
import rotiBg from '../assets/backgrounds/roti-bg.jpg';
import otherBg from '../assets/backgrounds/other-bg.jpg';

import { Soup, Vegan, CookingPot, Wheat, Salad, Beer } from 'lucide-react';

const MenuView = () => {
  const { addToCart, setPageBackground } = useAppContext();
  const [openSection, setOpenSection] = useState(null);
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const handleToggle = (title, bgImage) => {
    if (openSection === title) {
      setPageBackground(defaultBg);
      setOpenSection(null);
    } else {
      setPageBackground(bgImage);
      setOpenSection(title);
    }
  };
  
  const handleAddToCart = (item, size, price) => {
    addToCart(item, size, price);
    const uniqueId = `${item.name}-${size || 'Regular'}`;
    setRecentlyAdded(uniqueId);
    setTimeout(() => {
      setRecentlyAdded(null);
    }, 1500);
  };

  const menuCategories = [
    { key: 'paneer', title: 'PANEER', Icon: Vegan, items: menuData.paneer, bgImage: paneerBg },
    { key: 'sabji', title: 'SABJI', Icon: Salad, items: menuData.sabji, bgImage: sabjiBg },
    { key: 'dal', title: 'DAL', Icon: Soup, items: menuData.dal, bgImage: dalBg },
    { key: 'roti', title: 'ROTI', Icon: Wheat, items: menuData.roti, bgImage: rotiBg },
    { key: 'rice', title: 'RICE', Icon: CookingPot, items: menuData.rice, bgImage: riceBg },
    { key: 'other', title: 'OTHER', Icon: Beer, items: menuData.other, bgImage: otherBg }
  ];

  return (
    <div className="container mx-auto px-4 -mt-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-amber-400 mb-2">
          Our Delicious Menu
        </h2>
        <p className="text-gray-200 text-lg">
          Select a category to explore our offerings
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuCategories.map(({ key, bgImage, ...restOfCategory }) => (
          <div key={key} className="w-full">
            <AccordionSection
              {...restOfCategory}
              isOpen={openSection === restOfCategory.title}
              onToggle={() => handleToggle(restOfCategory.title, bgImage)}
              recentlyAdded={recentlyAdded}
              handleAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuView;