"use client";
import { useState, useEffect } from "react";

export default function AddToCartButton({ productId }) {
  const [productQte, setProductQte] = useState(0);
  const [isInCart, setIsInCart] = useState(false);

  // تحديث العرض عند تحميل الصفحة
  useEffect(() => {
    updateDisplay();
  }, [productId]);

  // دالة لتحديث العرض من localStorage
  const updateDisplay = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = storedCart.find((item) => item?.id === productId);
    setIsInCart(!!product);
    setProductQte(product?.qte || 0);
  };

  const addProductToCart = () => {
    //get the updated state of the cart directly from the source
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    // search using the id of the product in the cart, if found get her index in the cart list
    const foundIndex = currentCart.findIndex((item) => item.id === productId);

    let updatedCart;
    if (foundIndex === -1) {
      // the product is not in the cart - add it
      updatedCart = [...currentCart, { id: productId, qte: 1 }];
    } else {

      updatedCart = [...currentCart];
      updatedCart[foundIndex] = {
        ...updatedCart[foundIndex],
        qte: updatedCart[foundIndex].qte + 1
      };
    }
    // save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // update the display
    updateDisplay();
  };

  return (
    <button
      className={`
        group relative w-full px-4 py-2.5 rounded-lg font-semibold text-sm
        transition-all duration-300 overflow-hidden
        ${isInCart
          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30'
        }
        hover:shadow-xl hover:scale-105 active:scale-95
      `}
      onClick={addProductToCart}
    >
      {/* Efecto de brillo animado */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

      {/* Contenido del botón */}
      <span className="relative flex items-center justify-center gap-2">
        {/* Icono del carrito */}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isInCart ? 'group-hover:scale-110 group-hover:rotate-12' : 'group-hover:scale-110'}`}
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

        {/* Texto */}
        <span>
          {isInCart ? 'Added' : 'Add to Cart'}
        </span>

        {/* Badge de cantidad */}
        {isInCart && (
          <span className="absolute -top-1 -right-1 bg-white text-emerald-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            {productQte}
          </span>
        )}
      </span>
    </button>
  );
}