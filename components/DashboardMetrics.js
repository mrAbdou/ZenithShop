"use client";
import { useAvailableProductsCount, useProductsCount } from "@/lib/tanStackHooks/products.js";
import { useUsersCount, useCustomersCount } from "@/lib/tanStackHooks/users";
import { useActiveOrdersCount } from "@/lib/tanStackHooks/orders";
import { useQuery } from "@tanstack/react-query";
export default function DashboardMetrics({
    availableProductsCount,
    activeOrdersCount,
    productsCount,
    usersCount,
    customersCount
}) {
    const { data: nbrAvailableProducts } = useQuery({
        queryKey: ["availableProductsCount"],
        initialData: availableProductsCount,
        queryFn: () => useAvailableProductsCount()
    });
    const { data: nbrActiveOrders } = useQuery({
        queryKey: ["activeOrdersCount"],
        initialData: activeOrdersCount,
        queryFn: () => useActiveOrdersCount()
    });
    const { data: nbrProducts } = useQuery({
        queryKey: ["productsCount"],
        initialData: productsCount,
        queryFn: () => useProductsCount()
    });
    const { data: nbrUsers } = useQuery({
        queryKey: ["usersCount"],
        initialData: usersCount,
        queryFn: () => useUsersCount()
    });
    const { data: nbrCustomers } = useQuery({
        queryKey: ["customersCount"],
        initialData: customersCount,
        queryFn: () => useCustomersCount()
    });
    return (
        <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Products Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                                    <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path d="M6 16a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">Products</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Available in Stock</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrAvailableProducts}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Items ready for sale</p>
                        </div>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">Customers</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Registered Users</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrCustomers}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Active customer accounts</p>
                        </div>
                    </div>
                </div>

                {/* Active Orders Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 2a1 1 0 011-1h12a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V2zm9 4.5a1 1 0 01-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">Orders</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Active Orders</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrActiveOrders}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Pending &amp; in transit</p>
                        </div>
                    </div>
                </div>

                {/* Placeholder Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">Analytics</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">Store Performance</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">—</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Coming soon</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-indigo-600 mb-2">{nbrProducts}</p>
                        <p className="text-gray-600 text-sm">Total Products</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600 mb-2">{nbrUsers}</p>
                        <p className="text-gray-600 text-sm">Total Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600 mb-2">{nbrActiveOrders}</p>
                        <p className="text-gray-600 text-sm">Active Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600 mb-2">✓</p>
                        <p className="text-gray-600 text-sm">System Online</p>
                    </div>
                </div>
            </div>
        </>
    );
}