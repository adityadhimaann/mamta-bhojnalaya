import React from 'react';
import Product from './Product';

export default function ProductList(props) {
  return (
    <div>
      {props.productList.map((product, index) => (
        <Product
          key={index}
          product={product}
          index={index}
          onIncrement={props.onIncrement}
          onDecrement={props.onDecrement}
        />
      ))}
    </div>
  );
}
