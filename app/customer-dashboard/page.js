import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import OrdersTable from "@/components/OrdersTable";
import { Role } from "@prisma/client";

export default async function CustomerDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !(session.user.role === Role.CUSTOMER)) {
        console.log('session.user.role', session.user.role);
        return redirect('/');
    }
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">{session.user.name}'s Customer Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage your account and view your orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Account Metrics Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Registration Date</span>
                                    <span className="text-gray-900">{session.user.createdAt.toISOString().split('T').join(' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Orders</span>
                                    <span className="text-gray-900">{"-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders and Profile Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Orders Table Section */}
                        <OrdersTable />

                        {/* Profile Section */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                                            -
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                                            -
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                                            -
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                                            -
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
