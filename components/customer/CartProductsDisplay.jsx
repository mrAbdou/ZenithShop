'use client';
import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
export default function CartProductsDisplay({ cartTranslations }) {
    const { getCart, addToCart, removeFromCart } = useCartContext();
    const cart = getCart();
    const { data: session } = authClient.useSession();
    const router = useRouter();

    // Use the cart translations directly
    const t = cartTranslations;
    const goToCheckoutPage = () => {
        if (!session) {
            const redirectTo = encodeURIComponent('/checkout/confirmation');
            router.push(`/auth?redirectTo=${redirectTo}`);
            return;
        }
        router.push('/checkout/confirmation');
    }
    if (cart.length === 0) {
        return (
            <div className="max-w-md mx-auto p-8">
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-12 text-center">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                            <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.emptyCart}</h2>
                        <p className="text-gray-600 mb-8">{t.emptyCartMessage}</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            {t.startShopping}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.cartTitle}</h2>
                <p className="text-gray-600">{t.cartSubtitle}</p>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                {/* Product Info */}
                                <div className="flex items-center space-x-6 flex-1">
                                    {/* Product Image Placeholder */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.description}
                                        </p>
                                        {/* Product Price */}
                                        <p className="text-blue-600 font-bold mt-1">${item.price}</p>
                                    </div>
                                </div>

                                {/* Quantity Controls & Total */}
                                <div className="flex items-center space-x-6">
                                    {/* Quantity */}
                                    <div className="flex items-center bg-gray-100 rounded-xl">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-l-xl transition-colors font-bold text-lg"
                                            onClick={() => removeFromCart(item)}
                                            aria-label={t.decreaseQuantity}
                                        >
                                            −
                                        </button>
                                        <span className="w-16 h-10 flex items-center justify-center bg-white text-gray-800 font-semibold">
                                            {item.qte}
                                        </span>
                                        <button
                                            className={`w-10 h-10 flex items-center justify-center rounded-r-xl transition-colors font-bold text-lg ${item.qte >= item.qteInStock
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                                }`}
                                            onClick={() => addToCart(item)}
                                            aria-label={item.qte >= item.qteInStock ? t.maxQuantityReached : t.increaseQuantity}
                                            disabled={item.qte >= item.qteInStock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-lg font-bold text-gray-800">${(item.price * item.qte).toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">{t.each.replace('{price}', item.price)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Summary Details */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t.totalItems}</span>
                            <span className="font-semibold text-gray-800">{cart.reduce((sum, item) => sum + item.qte, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t.subtotal}</span>
                            <span className="font-semibold text-gray-800">${cart.reduce((sum, item) => sum + (item.price * item.qte), 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t.shipping}</span>
                            <span className="font-semibold text-green-600">{t.free}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                            <span className="text-lg font-semibold text-gray-800">{t.total}</span>
                            <span className="text-2xl font-bold text-blue-600">${cart.reduce((sum, item) => sum + (item.price * item.qte), 0).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="flex flex-col justify-center space-y-4">
                        <button onClick={goToCheckoutPage} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg">
                            {t.proceedToCheckout}
                        </button>
                        <button onClick={() => router.push('/products')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200">
                            {t.continueShopping}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
