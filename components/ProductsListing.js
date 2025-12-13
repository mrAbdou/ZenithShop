'use client';
import { LIMIT } from "@/lib/constants";
import Product from "./Product";
import { useProducts } from "@/hooks/products";
export default function ProductsListing({ initialData = [] }) {
    const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useProducts(LIMIT, 0, initialData);
    const products = data?.pages?.flat() || [];
    return (
        <>
            {/* Initial Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">Loading products...</span>
                    </div>
                </div>
            )}

            {!isLoading && (
                <>
                    {/* Products Grid */}
                    {products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Product key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {products.length > 0 && (
                        <div className="text-center mt-8">
                            {hasNextPage ? (
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:transform-none inline-flex items-center gap-2"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Load More Products
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 inline-block">
                                    <p className="text-gray-600 font-medium">All products have been loaded</p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Empty State */}
                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
                            <p className="text-gray-500">Check back soon for new arrivals!</p>
                        </div>
                    )}
                </>
            )}
        </>
    )
}
