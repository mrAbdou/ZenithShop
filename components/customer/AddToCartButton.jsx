"use client";
import { useState, useEffect } from "react";
import { useCartContext } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { getCart, addToCart, removeFromCart } = useCartContext();
  const cart = getCart();
  const [isInCart, setIsInCart] = useState(false);
  const [productQte, setProductQte] = useState(0);

  useEffect(() => {
    updateDisplay();
  }, [product.id, cart]);

  const updateDisplay = () => {
    const productInCart = cart.find(item => item.id === product.id);
    setProductQte(productInCart?.qte || 0);
    setIsInCart(!!productInCart);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleIncrement = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    removeFromCart(product);
  };

  const isOutOfStock = product.qteInStock === 0;
  const isMaxStockReached = productQte >= product.qteInStock;
  const canDecrement = productQte > 0;

  // Out of Stock State
  if (isOutOfStock) {
    return (
      <div className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-gray-400 font-semibold text-sm text-center cursor-not-allowed border border-gray-200">
        Out of Stock
      </div>
    );
  }

  // In Cart State - Show quantity controls
  if (isInCart && productQte > 0) {
    return (
      <div className="flex items-center gap-2 w-full">
        {/* Minus Button */}
        <button
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={`
            w-10 h-10 rounded-lg font-bold text-lg transition-all duration-200
            flex items-center justify-center shadow-md
            ${canDecrement
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Quantity Display */}
        <div className="flex-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-bold text-emerald-700 text-lg">{productQte}</span>
            <span className="text-emerald-600 text-sm">In Cart</span>
          </div>
        </div>

        {/* Plus Button */}
        <button
          onClick={handleIncrement}
          disabled={isMaxStockReached}
          className={`
            w-10 h-10 rounded-lg font-bold text-lg transition-all duration-200
            flex items-center justify-center shadow-md
            ${!isMaxStockReached
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  }

  // Not in Cart State - Show Add to Cart button
  return (
    <button
      onClick={handleAddToCart}
      className={`
        group relative w-full px-4 py-2.5 rounded-lg font-semibold text-sm
        transition-all duration-300 overflow-hidden shadow-lg
        bg-gradient-to-r from-blue-600 to-indigo-600 
        hover:from-blue-700 hover:to-indigo-700 
        text-white hover:shadow-xl hover:scale-105 active:scale-95
      `}
    >
      {/* Shimmer Effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

      {/* Button Content */}
      <span className="relative flex items-center justify-center gap-2">
        {/* Cart Icon */}
        <svg
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {/* Button Text */}
        <span>Add to Cart</span>

        {/* Stock Indicator */}
        {product.qteInStock <= 5 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {product.qteInStock}
          </span>
        )}
      </span>
    </button>
  );
}