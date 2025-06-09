import React, { useState } from 'react';
import ProductList from './components/ProductList';
import './App.css';
import PropTypes from 'prop-types';
function App() {
  const [productList, setProductList] = useState([
    {
      price: 50000,
      quantity: 0,
      name: "iphone x",
    },
    {
      price: 60000,
      quantity: 0,
      name: "iphone x+",
    }
  ]);

  const incrementQuantity = (index) => {
    const newList = [...productList];
    newList[index].quantity++;
    setProductList(newList);
  };

  const decrementQuantity = (index) => {
    const newList = [...productList];
    if (newList[index].quantity > 0) {
      newList[index].quantity--;
    }
    setProductList(newList);
  };

  return (
    <>
      <Navbar title="Navbar"/>
      <ProductList
        productList={productList}
        onIncrement={incrementQuantity}
        onDecrement={decrementQuantity}
      />
    </>
  );
}


export default App;
