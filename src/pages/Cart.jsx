import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import products from "../data/products.js";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const navigate = useNavigate();
  const isAdmin = true; // Change this based on real authentication

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
    }

  }, [navigate]);

  // Get the latest price for an item based on its ID
  const getProductPrice = (id) => {
    const product = products.find((product) => product.id === id);
    return product ? product.price : cart.find((item) => item.id === id)?.price || 0;
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + getProductPrice(item.id) * item.quantity, 0).toFixed(2);

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <h2 className="mb-3">
        <Link to="/" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        {" "} Cart Items
      </h2>

      {cart.length === 0 ? (
       <p className="alert alert-warning">{auth.currentUser?.email} cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="card mb-3" key={item.id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">{item.title}</h5>
                  <p className="text-muted mb-0">₹{getProductPrice(item.id).toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <span className="mx-2">Qty: {item.quantity}</span>

                  {/* Increase Quantity Button */}
                  <button
                    className="btn btn-outline-success btn-sm mx-1"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>

                  {/* Decrease Quantity Button (Disabled if quantity is 1) */}
                  <button
                    className="btn btn-outline-danger btn-sm mx-1"
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity === 1} // Disable when quantity is 1
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>

                  {/* Remove Item Button */}
                  <button
                    className="btn btn-outline-danger btn-sm ms-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total Price */}
          <h4 className="mt-4">
            Total Price: <span className="text-success">₹{totalPrice}</span>
          </h4>
        </>
      )}
    </div>
  );
};

export default Cart;
