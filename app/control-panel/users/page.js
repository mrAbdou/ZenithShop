import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetchUsers, fetchUsersCount } from "@/services/users.server";
import { minLimit } from "@/lib/constants";

export const metadata = {
    title: "Users Management | ZenithShop Admin",
    description: "Admin interface for managing ZenithShop users. View, manage, and organize user accounts efficiently with real-time updates and analytics.",
}

export default async function UsersManagementPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({
        headers: h
    });

    if (!session || !(session?.user?.role === Role.ADMIN)) return redirect("/");

    let users = [];
    let usersCount = 0;
    let error = '';

    try {
        const variables = { limit: minLimit, currentPage: 1 };
        users = await fetchUsers(variables, cookieHeader);
        usersCount = await fetchUsersCount(variables, cookieHeader);
    } catch (err) {
        error = err.message;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Users Management
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                Manage user accounts efficiently
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                Here you can view, manage, and organize user accounts in your system. Track user roles, permissions, and activity.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">{usersCount}</p>
                                    <p className="text-blue-100 text-sm">Total Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* Users Management Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Users List</h2>
                        {/* TODO: here you can put your CSR components that I'm going to create later */}
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {/* TODO: here you can put your CSR components that I'm going to create later */}
                                                <span className="text-blue-600 hover:text-blue-900 cursor-pointer">View</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Showing {users.length} of {usersCount} users
                        </div>
                        <div className="flex gap-2">
                            {/* TODO: here you can put your CSR components that I'm going to create later */}
                            <button
                                disabled={users.length === 0 || usersCount <= minLimit}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${users.length === 0 || usersCount <= minLimit ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
