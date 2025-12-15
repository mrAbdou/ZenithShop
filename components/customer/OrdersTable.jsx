'use client';

import { useMyOrders } from "@/hooks/users";

export default function OrdersTable({ initialData = {} }) {
    const { data: orders } = useMyOrders(initialData);

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-2xl font-bold">My Orders</h2>
            </div>

            {/* Mobile: Card Layout */}
            <div className="block md:hidden divide-y divide-gray-100">
                {orders?.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-medium text-gray-900">Order #{order.id.slice(-8)}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toISOString().slice(0, 10)}</p>
                            <p><span className="font-medium">Total:</span> ${order.total}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(order.createdAt).toISOString().slice(0, 10)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ${order.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(!orders || orders.length === 0) && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No orders found</p>
                    <p className="text-gray-400 text-sm">Place your first order to see it here</p>
                </div>
            )}
        </div>
    );
}
