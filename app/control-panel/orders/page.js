import OrdersManagement from "@/components/OrdersManagement";
import { auth } from "@/lib/auth";
import { fetchOrders } from "@/services/orders.server"
import { OrderStatus, Role } from "@prisma/client";
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
    const searchQuery = '';
    const status = OrderStatus.PENDING;
    const startDate = null;
    const endDate = null;
    const sortBy = null;
    const sortDirection = null;
    let orders = [];
    try {
        orders = await fetchOrders(cookieHeader, searchQuery, status, startDate, endDate, sortBy, sortDirection);
        console.log('orders from the page : ', orders);
    } catch (error) {
        console.log('Error', error.message);
    }
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

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
