import CartProductsDisplay from "@/components/CartProductsDisplay";
export const metadata = {
    title: "Shopping Cart | ZenithShop",
    description: "Review your selected items, adjust quantities, and proceed to secure checkout at ZenithShop. Manage your shopping cart and complete your purchase.",
}
export default function CartPage() {
    return (
        <div className="min-h-screen p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-12 mb-12 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
                        <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Your
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Shopping Cart</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                        Review your selected items, adjust quantities, and proceed to checkout when ready.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Secure Checkout
                        </div>
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                            Easy Returns
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Content */}
            <CartProductsDisplay />
        </div>
    );
}
