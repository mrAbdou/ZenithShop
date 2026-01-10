'use client';
import { useCartContext } from '@/context/CartContext';
import { useFeaturedProducts } from '@/hooks/products';

export default function FeaturedProducts({ initialData }) {
    const { data: products, isLoading, error } = useFeaturedProducts({ head: 4 }, initialData);
    const { getCart, addToCart, removeFromCart } = useCartContext();
    const cart = getCart();

    const getProductCartElement = (product) => {
        const productInCart = cart.find(item => item.id === product.id);
        const quantity = productInCart?.qte || 0;
        const isOutOfStock = product.qteInStock === 0;
        const canDecrement = quantity > 0;
        const canIncrement = quantity < product.qteInStock;

        if (isOutOfStock) {
            return (
                <div className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-400 font-semibold text-sm text-center cursor-not-allowed">
                    Out of Stock
                </div>
            );
        }

        if (quantity > 0) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => removeFromCart(product)}
                        disabled={!canDecrement}
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold transition-colors ${canDecrement
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="font-bold text-lg text-gray-800 min-w-[2rem] text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!canIncrement}
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-lg font-bold transition-colors ${canIncrement
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            );
        } else {
            return (
                <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add to Cart
                </button>
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-medium">Something went wrong</span>
                    {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-gray-600">
                                    {product.name.charAt(0)}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>

                        <div className="mt-2 text-center text-sm text-gray-600">
                            ${product.price.toFixed(2)}
                        </div>

                        <div className="mt-4 text-center">
                            {getProductCartElement(product)}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
