'use client';
import React, { useMemo, useCallback, useState } from "react";
import { useOrderFiltersContext } from "@/context/OrdersFiltersContext";
import { useCountFilteredOrders, useDeleteOrder, useOrders } from "@/hooks/orders";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { OrderStatus } from "@prisma/client";
import { MAX_VISIBLE_NAVIGATION_BTN } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
};

export default function OrdersTable({ initialData }) {
    const { t } = useTranslation();
    const { filters, updateSortingProps, setPaginationCurrentPage, setPaginationLimit } = useOrderFiltersContext();
    const { data: filteredOrdersCount } = useCountFilteredOrders({
        searchQuery: filters.searchQuery,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
    });
    const router = useRouter();
    const { data: orders, isLoading, error } = useOrders(filters, initialData);
    const { mutateAsync: deleteOrderAsync } = useDeleteOrder();

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const openDeleteModal = (order) => {
        setOrderToDelete(order);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            await deleteOrderAsync(orderToDelete.id, {
                onSuccess: () => {
                    toast.success(t('admin.orders.orderDeleted'));
                    closeDeleteModal();
                },
                onError: (error) => {
                    toast.error(`${t('admin.orders.deleteFailed')}: ${error.message}`);
                }
            });
        } catch (error) {
            toast.error(t('admin.orders.deleteFailed'));
        }
    };

    const totalPages = useMemo(() => Math.ceil(filteredOrdersCount / filters.limit), [filteredOrdersCount, filters.limit]);

    const getVisiblePages = useCallback((currentPage, totalPages, maxVisible = MAX_VISIBLE_NAVIGATION_BTN) => {
        const pages = [];

        // Always show first page
        if (totalPages >= 1) pages.push(1);

        // Calculate range around current page
        let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, start + maxVisible - 1);

        // Adjust if near start/end
        if (end - start + 1 < maxVisible) {
            start = Math.max(2, end - maxVisible + 1);
        }

        // Add ellipsis before range if needed
        if (start > 2) pages.push('...');

        // Add page range
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }

        // Add ellipsis after range if needed
        if (end < totalPages - 1) pages.push('...');

        // Always show last page
        if (totalPages > 1) pages.push(totalPages);

        return pages.filter((page, index, arr) =>
            // Remove consecutive ellipsis
            !(page === '...' && arr[index - 1] === '...')
        );
    }, [filters.currentPage, totalPages]); // Only depends on currentPage and totalPages
    const headersMapping = {
        [t('admin.orders.orderId')]: 'id',
        [t('admin.orders.customer')]: 'user.name',
        [t('admin.orders.date')]: 'createdAt',
        [t('admin.orders.status')]: 'status',
        [t('admin.orders.total')]: 'total',
        [t('admin.orders.items')]: 'items',
    }
    const reverseHeadersMapping = {
        'id': t('admin.orders.orderId'),
        'user.name': t('admin.orders.customer'),
        'createdAt': t('admin.orders.date'),
        'status': t('admin.orders.status'),
        'total': t('admin.orders.total'),
    }
    const onTableHeaderClicked = (e) => {
        e.preventDefault();
        const headerText = e.target.textContent.replace(/[↑↓]/g, '').trim();
        const field = headersMapping[headerText];
        let newSortBy;
        let newSortDirection;
        if (!field) {
            return;
        }
        if (filters.sortBy === field) {
            if (filters.sortDirection === 'desc') {
                newSortDirection = 'asc';
                newSortBy = field;
            } else if (filters.sortDirection === 'asc') {
                newSortDirection = '';
                newSortBy = '';
            } else {
                newSortDirection = 'desc';
                newSortBy = field;
            }
        } else {
            newSortBy = field;
            newSortDirection = 'desc';
        }
        //TODO: we need to use OrderFilterSchema to check the new values first
        updateSortingProps({
            sortBy: newSortBy,
            sortDirection: newSortDirection
        });
    }


    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.orders.orderHistory')}</h2>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.orders.orderHistory')}</h2>
                <div className="text-red-600">{t('admin.orders.errorLoadingOrders')} {error.message}</div>
            </div>
        );
    }
    const onChangeLimit = (e) => {
        setPaginationLimit(parseInt(e.target.value.trim()));
    }
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.orders.orderHistory')}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {t('admin.orders.orderId')}{filters.sortBy === 'id' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {t('admin.orders.customer')}{filters.sortBy === 'user.name' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {t('admin.orders.date')}{filters.sortBy === 'createdAt' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {t('admin.orders.status')}{filters.sortBy === 'status' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {t('admin.orders.total')}{filters.sortBy === 'total' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.orders.items')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.orders.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id.slice(-8)} {/* Show last 8 chars */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${order.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.items?.length || 0} {t('admin.orders.items')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button onClick={() => router.push(`/control-panel/orders/${order.id}`)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {t('admin.orders.view')}
                                        </button>
                                        <button onClick={() => router.push(`/control-panel/orders/${order.id}/update`)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {t('admin.orders.update')}
                                        </button>
                                        <button onClick={() => openDeleteModal(order)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    {t('admin.orders.noOrdersFound')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Partition */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    {t('common.showing')} {((filters.currentPage - 1) * filters.limit) + 1} {t('common.to')} {Math.min(filters.currentPage * filters.limit, filteredOrdersCount || 0)} {t('common.of')} {filteredOrdersCount || 0} {t('admin.orders.showingOrders')}
                </div>
                <div className="flex items-center gap-2">
                    <select
                        onChange={onChangeLimit}
                        value={filters.limit}
                        className="block w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${filters.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 hover:bg-gray-50'}`}
                        disabled={filters.currentPage === 1}
                        onClick={() => setPaginationCurrentPage(filters.currentPage - 1)}
                    >
                        {t('common.previous')}
                    </button>
                    {getVisiblePages(filters.currentPage, totalPages, 7).map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded-md text-sm ${page === filters.currentPage
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                                    }`}
                                onClick={() => setPaginationCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${filters.currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 hover:bg-gray-50'}`}
                        disabled={filters.currentPage === totalPages}
                        onClick={() => setPaginationCurrentPage(filters.currentPage + 1)}
                    >
                        {t('common.next')}
                    </button>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && orderToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">{t('admin.orders.deleteOrder')}</h3>
                                <p className="text-sm text-gray-500">{t('admin.orders.deleteOrderConfirm')}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700">
                                {t('admin.orders.orderId')}: <span className="font-semibold">{orderToDelete.id.slice(-8)}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                {t('admin.orders.customer')}: <span className="font-semibold">{orderToDelete.user.name}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                {t('admin.orders.total')}: <span className="font-semibold">${orderToDelete.total}</span>
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                {t('admin.orders.orderWillBeRemoved')}
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t('admin.orders.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteOrder}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-300 font-semibold flex items-center"
                            >
                                <svg className="w-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t('admin.orders.deleteOrder')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
