'use client';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartFloatingButton() {
    const { getCart } = useCartContext();
    const cart = getCart();
    const router = useRouter();

    const totalItems = cart.reduce((sum, item) => sum + item.qte, 0);

    // Don't show if cart is empty
    if (totalItems === 0) return null;

    return (
        <button
            onClick={() => router.push('/cart')}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label={`Go to cart with ${totalItems} items`}
        >
            {/* Main Button */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-out">
                {/* Pulse Animation Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-teal-400 animate-ping opacity-20"></div>

                {/* Inner Ring */}
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 border-2 border-white/20">
                    {/* Cart Icon */}
                    <div className="relative">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>

                        {/* Item Count Badge */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                            {totalItems}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>Checkout • ${cart.reduce((sum, item) => sum + (item.price * item.qte), 0).toFixed(2)}</span>
                </div>
            </div>

            {/* Mobile Tooltip arrow */}
            <div className="hidden md:block absolute bottom-full right-6 mb-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 group-hover:opacity-100 opacity-0 transition-opacity duration-200"></div>
        </button>
    );
}
