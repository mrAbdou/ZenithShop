//start better auth import--------------------------------------
import { auth } from "@/lib/auth";
//end better auth import----------------------------------------

//start services import-----------------------------------------
import { fetchOrder } from "@/services/orders.server";
//end services import-------------------------------------------

//start prisma import-------------------------------------------
import { Role, OrderStatus } from "@prisma/client";
//end prisma import---------------------------------------------

//start next import---------------------------------------------
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
//end next import-------------------------------------------------

//start i18n import---------------------------------------------
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
//end i18n import-----------------------------------------------

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
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    
    if (!session || session?.user?.role !== Role.ADMIN) {
        return redirect("/");
    }
    const order = await fetchOrder({ id: orderId }, cookieHeader);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto p-6 md:p-10">
                {/* Breadcrumb Navigation */}
                <nav className="text-sm text-gray-500 mb-8">
                    <Link href="/control-panel" className="hover:text-blue-600 transition-colors">{dictionary.admin.orders.controlPanel}</Link>
                    <span className="mx-2 text-gray-400">→</span>
                    <Link href="/control-panel/orders" className="hover:text-blue-600 transition-colors">{dictionary.admin.orders.orders}</Link>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-gray-800 font-medium">{dictionary.admin.orders.orderId} #{order.id.slice(-8)}</span>
                </nav>

                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="flex-1">
                                <Link href="/control-panel/orders" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-all duration-200 hover:scale-105">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="font-medium">{dictionary.admin.orders.backToOrders}</span>
                                </Link>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                    {dictionary.admin.orders.orderDetails}
                                </h1>
                                <p className="text-blue-100 text-lg mb-2">
                                    {dictionary.admin.orders.orderId} #{order.id.slice(-8)}
                                </p>
                                <p className="text-blue-50/90 max-w-2xl leading-relaxed">
                                    {dictionary.admin.orders.orderDetailsDesc}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-white mb-1">${order.total}</p>
                                        <p className="text-blue-100 text-sm font-medium">{dictionary.admin.orders.totalAmount}</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                                    <div className="flex items-center justify-center">
                                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full ${order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === OrderStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                                                    order.status === OrderStatus.SHIPPED ? 'bg-purple-100 text-purple-800' :
                                                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                                            order.status === OrderStatus.RETURNED ? 'bg-orange-100 text-orange-800' :
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

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Actions & Customer Info */}
                    <div className="lg:col-span-1 space-y-8">


                        {/* Customer Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{dictionary.admin.orders.customerDetails}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.fullName}</span>
                                    <span className="text-sm font-semibold text-gray-900">{order.user.name}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.email}</span>
                                    <span className="text-sm font-semibold text-gray-900 break-all">{order.user.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.phone}</span>
                                    <span className="text-sm font-semibold text-gray-900">{order.user.phoneNumber || dictionary.admin.orders.notProvided}</span>
                                </div>
                                <div className="flex items-start justify-between py-3">
                                    <span className="text-sm font-medium text-gray-500 mr-4">{dictionary.admin.orders.address}</span>
                                    <span className="text-sm font-semibold text-gray-900 text-right leading-relaxed">{order.user.address || dictionary.admin.orders.notProvided}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Information Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{dictionary.admin.orders.orderSummary}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 mb-1">${order.total}</div>
                                    <div className="text-sm text-gray-500">{dictionary.admin.orders.orderTotal}</div>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.orderId}</span>
                                        <span className="text-sm font-mono font-semibold text-gray-900">#{order.id.slice(-8)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.status}</span>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === OrderStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                                                    order.status === OrderStatus.SHIPPED ? 'bg-purple-100 text-purple-800' :
                                                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                                            order.status === OrderStatus.RETURNED ? 'bg-orange-100 text-orange-800' :
                                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.created}</span>
                                        <span className="text-sm font-semibold text-gray-900">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-500">{dictionary.admin.orders.items}</span>
                                        <span className="text-sm font-semibold text-gray-900">{order.items.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{dictionary.admin.orders.orderItems}</h3>
                                        <p className="text-purple-100 text-sm">{dictionary.admin.orders.orderItemsDesc}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                                            } hover:shadow-md hover:border-gray-300`}>
                                            <div className="flex items-center flex-1">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-4">
                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-900">{item.product.name}</h4>
                                                    <p className="text-xs text-gray-500">${item.product.price} {dictionary.admin.orders.each}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-center">
                                                    <div className="text-sm font-bold text-gray-900">{item.qte}</div>
                                                    <div className="text-xs text-gray-500">{dictionary.admin.orders.qty}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">${(item.qte * item.product.price).toFixed(2)}</div>
                                                    <div className="text-xs text-gray-500">{dictionary.admin.orders.total}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total Summary */}
                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{dictionary.admin.orders.orderTotal}</h4>
                                                <p className="text-sm text-gray-600">{order.items.length} {dictionary.admin.orders.items}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-gray-900">${order.total}</div>
                                                <div className="text-sm text-gray-600">{dictionary.admin.orders.finalAmount}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Actions Card - Below Order Items */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-8">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{dictionary.admin.orders.orderActions}</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <Link
                                        href={`/control-panel/orders/${orderId}/update`}
                                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>{dictionary.admin.orders.editOrderStatus}</span>
                                    </Link>
                                    <p className="text-xs text-gray-500 text-center">
                                        {dictionary.admin.orders.modifyOrderStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
