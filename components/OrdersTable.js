'use client';
import { OrdersFiltersContext } from "@/context/OrdersFiltersContext";
import { useDeleteOrder, useOrders } from "@/hooks/orders";
import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
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
    // If initialData is provided and non-empty, use it directly (no client fetch needed)
    const router = useRouter();
    const { getFilters, setFilters } = useContext(OrdersFiltersContext);
    const filters = getFilters();
    const { data: orders, isLoading, error } = useOrders(initialData, filters);
    const { mutateAsync: deleteOrderAsync } = useDeleteOrder();
    const headersMapping = {
        'Order ID': 'id',
        'Customer': 'user.name',
        'Date': 'createdAt',
        'Status': 'status',
        'Total': 'total',
        'Items': 'items',
    }
    const reverseHeadersMapping = {
        'id': 'Order ID',
        'user.name': 'Customer',
        'createdAt': 'Date',
        'status': 'Status',
        'total': 'Total',
    }
    // meanings of counter values : 
    // 0 : no sorting
    // 1 : descending
    // 2 : ascending
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
                newSortDirection = null;
                newSortBy = null;
            } else {
                newSortDirection = 'desc';
                newSortBy = field;
            }
        } else {
            newSortBy = field;
            newSortDirection = 'desc';
        }
        setFilters({
            ...filters,
            sortBy: newSortBy,
            sortDirection: newSortDirection
        });
    }

    const onDeleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            deleteOrderAsync(id, {
                onSuccess: () => {
                    toast.success('Order deleted successfully');
                },
                onError: (error) => {
                    toast.error(`Failed to delete order: ${error.message}`);
                }
            });
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
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
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                <div className="text-red-600">Error loading orders: {error.message}</div>
            </div>
        );
    }
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Order ID{filters.sortBy === 'id' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Customer{filters.sortBy === 'user.name' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Date{filters.sortBy === 'createdAt' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Status{filters.sortBy === 'status' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th onClick={onTableHeaderClicked} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                Total{filters.sortBy === 'total' && (filters.sortDirection === 'asc' ? ' ↑' : filters.sortDirection === 'desc' ? ' ↓' : '')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
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
                                    {order.items?.length || 0} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button onClick={() => router.push(`/control-panel/orders/${order.id}`)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                            View
                                        </button>
                                        <button onClick={() => router.push(`/control-panel/orders/${order.id}/update`)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                                            Update
                                        </button>
                                        <button onClick={() => onDeleteOrder(order.id)} className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
