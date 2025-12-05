'use client';
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CheckoutCartResume() {
    const { cart } = useContext(CartContext);

    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.qte, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qte), 0);
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
                            <p className="text-amber-100">Add some products to start your checkout</p>
                        </div>
                        <div className="p-8 text-center">
                            <a
                                href="/products"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Cart Items Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <p className="text-blue-100 text-sm">{totalItems} items in your cart</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                {/* Product Image Placeholder */}
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.qte}</p>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">${(item.price * item.qte).toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">${item.price} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Totals Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Shipping</span>
                            <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-300 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Free Shipping Notice */}
                        {subtotal < 100 && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-amber-800">
                                        Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
