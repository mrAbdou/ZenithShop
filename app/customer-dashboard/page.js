//start better auth import --------------------------------------
import { auth } from "@/lib/auth";
//end better auth import ------------------------------------------

//start next import -----------------------------------------------
import { headers } from "next/headers";
//end next import -------------------------------------------------

//start components import -----------------------------------------
import LogoutButton from "@/components/LogoutButton";
import UpdateCustomerProfileForm from "@/components/customer/UpdateCustomerProfileForm";
//end components import -------------------------------------------

//start services import -------------------------------------------
import { redirect } from "next/navigation";
import { fetchMyOrders } from "@/services/users.server";
//end services import ---------------------------------------------

//start prisma import ---------------------------------------------
import { Role } from "@prisma/client";
import OrdersTable from "@/components/customer/OrdersTable";
//end prisma import -----------------------------------------------

export default async function CustomerDashboard() {
    // checking the session of the customer
    const h = await headers();
    const session = await auth.api.getSession({
        headers: h,
    });
    if (!session || session?.user?.role !== Role.CUSTOMER) {
        const redirectUrl = encodeURIComponent('/customer-dashboard');
        redirect(`/auth?redirectTo=${redirectUrl}`);
    }
    // extract the cookie header, and get the orders list
    const cookieHeader = h.get('cookie') || '';
    const orders = await fetchMyOrders({}, cookieHeader);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{session?.user?.name}&#39;s Customer Dashboard</h1>
                            <p className="mt-2 text-gray-600">Manage your account and view your orders</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Registration Date</span>
                                    <span className="text-gray-900">{session?.user?.createdAt.toISOString().split('T').join(' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Orders</span>
                                    <span className="text-gray-900">{orders.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders and Profile Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* TODO: re-implement orders table again */}
                        <OrdersTable initialData={orders} />

                        {/* Profile Section */}
                        <UpdateCustomerProfileForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
