import OrdersManagement from "@/components/OrdersManagement";
import { auth } from "@/lib/auth";
import { fetchOrders } from "@/services/orders.server"
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata = {
    title: "Orders Management",
    description: "Orders Management",
}
export default async function OrdersManagementPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({
        // headers: { cookie: cookieHeader ?? "" }
        headers: h
    });
    if (!session || session.user.role !== Role.ADMIN) {
        return redirect("/");
    }
    let orders = [];
    try {
        // filters has a default value in fetchOrders so there is no need to pass it
        orders = await fetchOrders(cookieHeader);
    } catch (error) {
        console.log('Error', error.message);
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Orders Management
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                Manage customer orders efficiently
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                View and manage all orders placed by customers. Track order status, customer details, and order history in real-time.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">{orders.length}</p>
                                    <p className="text-blue-100 text-sm">Total Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Partition */}
            <OrdersManagement orders={orders} />

            {/* Pagination Partition */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing 1 to {orders.length} of {orders.length} orders
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
                </div>
            </section>
        </div>
    )
}
