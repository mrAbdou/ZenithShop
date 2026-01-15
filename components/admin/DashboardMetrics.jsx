"use client";
import { useActiveOrdersCount } from "@/hooks/orders";
import { useAvailableProductsCount, useProductsCount } from "@/hooks/products";
import { useUsersCount, useCustomersCount } from "@/hooks/users";
import { useCategoriesCount } from "@/hooks/categories";
import { useTranslation } from "@/lib/i18n/context";

export default function DashboardMetrics({
    availableProductsCount,
    activeOrdersCount,
    productsCount,
    usersCount,
    customersCount,
    categoriesCount
}) {
    const { t } = useTranslation();

    const { data: nbrAvailableProducts } = useAvailableProductsCount(availableProductsCount);
    const { data: nbrActiveOrders } = useActiveOrdersCount(activeOrdersCount);
    const { data: nbrProducts } = useProductsCount(productsCount);
    const { data: nbrUsers } = useUsersCount(usersCount);
    const { data: nbrCustomers } = useCustomersCount(customersCount);
    const { data: nbrCategories } = useCategoriesCount(categoriesCount);

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
                                <p className="text-gray-500 text-sm font-medium">{t('admin.dashboard.products')}</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">{t('admin.dashboard.availableInStock')}</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrAvailableProducts}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{t('admin.dashboard.itemsReadyForSale')}</p>
                        </div>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">{t('admin.dashboard.customers')}</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">{t('admin.dashboard.registeredUsers')}</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrCustomers}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{t('admin.dashboard.activeCustomerAccounts')}</p>
                        </div>
                    </div>
                </div>

                {/* Categories Card */}
                <div className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">{t('admin.dashboard.categories')}</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">{t('admin.dashboard.totalCategories')}</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrCategories}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{t('admin.dashboard.organizedCatalog')}</p>
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
                                <p className="text-gray-500 text-sm font-medium">{t('admin.dashboard.orders')}</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">{t('admin.dashboard.activeOrders')}</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">{nbrActiveOrders}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{t('admin.dashboard.pendingAndInTransit')}</p>
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
                                <p className="text-gray-500 text-sm font-medium">{t('admin.dashboard.analytics')}</p>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-2">{t('admin.dashboard.storePerformance')}</h3>
                        <p className="text-4xl md:text-5xl font-bold text-gray-900">—</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">{t('admin.dashboard.comingSoon')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-indigo-600 mb-2">{nbrProducts}</p>
                        <p className="text-gray-600 text-sm">{t('admin.dashboard.totalProducts')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600 mb-2">{nbrUsers}</p>
                        <p className="text-gray-600 text-sm">{t('admin.dashboard.totalUsers')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600 mb-2">{nbrActiveOrders}</p>
                        <p className="text-gray-600 text-sm">{t('admin.dashboard.activeOrders')}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600 mb-2">✓</p>
                        <p className="text-gray-600 text-sm">{t('admin.dashboard.systemOnline')}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
