import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";
import { fetchMyOrders } from "@/services/users.server";
import OrdersTable from "@/components/OrdersTable";
import UpdateCustomerProfileForm from "@/components/UpdateCustomerProfileForm";


export default async function CustomerDashboard() {
    const h = await headers(); // this gives me the headers that I'm going to need in service function to run
    // check if the user is truly signed in :

    const session = await auth.api.getSession({
        headers: h,
    });
    if (session?.user?.role !== "CUSTOMER") {
        // if not redirect to check out, that is going to ask him to sign in or sign up
        redirect('/checkout')
    }
    // extract the cookie header from the cookies
    const cookieHeader = h.get('cookie') || '';
    // pass this cookie header to the service function so it could be run successfully, because this header is the proof of the user being authorized
    const orders = await fetchMyOrders(cookieHeader);
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
                        <OrdersTable initialData={orders} />

                        {/* Profile Section */}
                        <UpdateCustomerProfileForm initialData={session?.user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
