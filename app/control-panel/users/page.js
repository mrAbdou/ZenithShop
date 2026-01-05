import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetchUsers, fetchUsersCount } from "@/services/users.server";
import { minLimit } from "@/lib/constants";
import UsersManagement from "@/components/admin/UsersManagement";

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

            {/* Users Management Component */}
            <UsersManagement users={users} />
        </div>
    )
}
