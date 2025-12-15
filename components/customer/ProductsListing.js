'use client';
import { LIMIT } from "@/lib/constants";
import Product from "../Product";
import { useProducts } from "@/hooks/products";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
export default function ProductsListing({ initialData = [] }) {
    const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useProducts(LIMIT, 0, initialData);
    const products = data?.pages?.flat() || [];
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px',
    });
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
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
                    {/* Sentinel element for intersection observer */}
                    <div
                        ref={ref}
                        className="flex justify-center items-center py-8"
                    >
                        {isFetchingNextPage && (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600 font-medium">Loading more products...</span>
                            </div>
                        )}
                        {!hasNextPage && !isFetchingNextPage && (
                            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                <p className="text-gray-600 font-medium">All products have been loaded</p>
                            </div>
                        )}
                    </div>
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
