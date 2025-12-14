import { auth } from "@/lib/auth";
import { fetchOrder } from "@/services/orders.server";
import { Role, OrderStatus } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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

export default async function OrderView({ params }) {
    const { orderId } = await params;
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({
        headers: { cookie: cookieHeader ?? "" }
    });
    if (!session || session.user.role !== Role.ADMIN) {
        return redirect("/");
    }
    const order = await fetchOrder(orderId, cookieHeader);
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <Link href="/control-panel/orders" className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Orders
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Order Details
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                Review order #{order.id.slice(-8)}
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                Detailed view of the customer's order including items, pricing, and order status. Manage and track order fulfillment here.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">${order.total}</p>
                                    <p className="text-blue-100 text-sm">Order Total</p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-center">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                {/* Customer Information */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-base font-medium text-gray-500">Name:</span>
                            <span className="text-base text-gray-900">{order.user.name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-base font-medium text-gray-500">Email:</span>
                            <span className="text-base text-gray-900">{order.user.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-base font-medium text-gray-500">Phone:</span>
                            <span className="text-base text-gray-900">{order.user.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-base font-medium text-gray-500">Address:</span>
                            <span className="text-base text-gray-900">{order.user.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Order Information */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-base font-medium text-gray-500">Created At:</span>
                            <span className="text-base text-gray-900">{formatDate(order.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qte}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(item.qte * item.product.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}