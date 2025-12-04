"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useProducts } from "@/lib/tanStackHooks/products.js";
import { useRouter } from "next/navigation";
import { LIMIT } from "@/lib/tanStackHooks/constants.js";
export default function ProductsTable({ limit = LIMIT, offset = 0 } = {}) {
    const router = useRouter();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["products", limit, offset],
        queryFn: ({ pageParam = 0 }) => useProducts(limit = LIMIT, offset = pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length * limit : undefined;
        },
        initialPageParam: 0,
    });
    const products = data?.pages?.flat() || [];
    console.log('from products table : ', products);
    const navigateToAddProductPage = () => {
        router.push("/control-panel/products/add-product");
    };
    return (
        <>
            {
                products?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={navigateToAddProductPage} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products?.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                        <div className="flex flex-col h-full">
                            {/* Product Info */}
                            <div className="flex-1 mb-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl font-bold text-green-600">
                                        ${product.price}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm">
                                    Update
                                </button>
                                <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {products.length > 0 && (
                <div className="text-center mt-8">
                    {hasNextPage ? (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
            {
                products?.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">Start building your product catalog by adding your first product.</p>
                        <button onClick={navigateToAddProductPage} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Your First Product
                        </button>
                    </div>
                )
            }
            {/* Footer Stats */}
            {products.length > 0 && (
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-indigo-600 mb-2">{products.length}</p>
                            <p className="text-gray-600 text-sm">Total Products</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600 mb-2">${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                            <p className="text-gray-600 text-sm">Total Value</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600 mb-2">${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}</p>
                            <p className="text-gray-600 text-sm">Average Price</p>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-sm">System Ready</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
