import React from "react";

export default function Product(props) {
  const { name, price, quantity } = props.product;
  const { index, onIncrement, onDecrement } = props;

  return (
    <div className="row p-4 my-3">
      <div className="col-5">
        <h2>
          {name}
          <span className="badge bg-secondary mx-2">₹{price}</span>
        </h2>
      </div>
      <div className="col-3">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onDecrement(index)}
          >
            -
          </button>
          <button type="button" className="btn btn-light" disabled>
            {quantity}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onIncrement(index)}
          >
            +
          </button>
        </div>
      </div>
      <div className="col-4 fw-bold">
        ₹{quantity * price}
      </div>
    </div>
  );
}
