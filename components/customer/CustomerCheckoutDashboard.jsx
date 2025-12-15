'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useAddOrder } from '@/hooks/orders';
import toast from 'react-hot-toast';
import { safeValidate, CreateOrderSchema } from '@/lib/zodSchemas';
import { useCartContext } from '@/context/CartContext';

export default function CustomerCheckoutDashboard() {
    const { getCart, clearCart } = useCartContext(); // here i get what user select to order
    const cart = getCart();
    const router = useRouter(); // this is used for empty cart, amdin instead of user etc ...
    const { mutateAsync: createOrder } = useAddOrder(); // the custom hook that is going to create the new order
    const { data: session } = authClient.getSession();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [orderComplete, setOrderComplete] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);

    const total = cart.reduce((sum, item) => sum + (item.price * item.qte), 0); // the total price of all products in cart
    const items = cart.map(item => ({
        productId: item.id,
        qte: item.qte,
    }));
    const new_order = { items, total };
    const items_count = cart.reduce((sum, item) => sum + item.qte, 0); // the total number of items in cart
    const handleConfirmOrder = async () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty, you need to select some products first!');
            router.push('/products');
            return;
        }

        if (cart.some(item => item.qte > item.qteInStock)) {
            toast.error('Some products are out of stock, please reduce the quantity or remove them from the cart!');
            return;
        }

        const validation = safeValidate(CreateOrderSchema, new_order);
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            toast.error(`Validation failed: ${errorMessages}`);
            return;
        }

        setIsProcessing(true);
        try {
            const order = await createOrder(validation.data, {
                onSuccess: (data) => {
                    setOrderComplete(true);
                    setCompletedOrder(data);
                },
            });
            clearCart();
            toast.success('Order placed successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    }
    const handleContinueShopping = () => {
        router.push('/products');
    };

    if (orderComplete && completedOrder) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Order Confirmed!</h2>
                    <p className="text-green-700 mb-6">Thank you for your order. Your order has been successfully placed.</p>

                    <div className="bg-white rounded-xl p-6 mb-6 max-w-md mx-auto">
                        <div className="text-sm text-gray-600 mb-2">Order ID</div>
                        <div className="text-lg font-mono font-semibold text-gray-800">{completedOrder.id}</div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push(`/customer-dashboard`)}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={handleContinueShopping}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-blue-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-blue-700 mb-6">You need items in your cart before you can complete an order.</p>
                    <button
                        onClick={handleContinueShopping}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Review Your Order</h2>
                <p className="text-gray-600">Please review your items and confirm your order</p>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                        <div key={item.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                        <p className="text-gray-600">{item.description}</p>
                                        <p className="text-blue-600 font-bold">${item.price}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-800">Qty: {item.qte}</div>
                                    <div className="text-xl font-bold text-blue-600">${(item.price * item.qte).toFixed(2)}</div>
                                </div>
                            </div>
                            {item.qte > item.qteInStock && (
                                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm font-medium">
                                        Insufficient stock! Available: {item.qteInStock}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal ({items_count} items):</span>
                            <span className="font-semibold text-gray-800">${total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-semibold text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-4">
                            <span className="text-lg font-semibold text-gray-800">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                        <button
                            onClick={handleConfirmOrder}
                            disabled={isProcessing || cart.some(item => item.qte > item.qteInStock)}
                            className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 ${isProcessing || cart.some(item => item.qte > item.qteInStock)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing Order...
                                </div>
                            ) : (
                                'Confirm Order'
                            )}
                        </button>
                        <button
                            onClick={() => router.push('/cart')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
