import { auth } from "@/lib/auth";
import DateTimeLive from "@/components/DateTimeLive";
import LogoutButton from "@/components/LogoutButton";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardMetrics from "@/components/DashboardMetrics";
import { fetchCustomersCount, fetchUsersCount } from "@/services/users";
import { fetchAvailableProductsCount, fetchProductsCount } from "@/services/products";
import { fetchActiveOrdersCount } from "@/services/orders";
export const metadata = {
    title: "Admin Dashboard | ZenithShop",
    description: "Admin dashboard for ZenithShop management. Monitor business metrics, products, orders, and customer data in real-time.",
}
export default async function ControlPanelDashboardPage() {
    // Get session from better-auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session?.user?.role !== Role.ADMIN) {
        redirect("/");
        return null;
    }

    // Fetch metrics
    const productsCount = await fetchProductsCount();
    const activeOrdersCount = await fetchActiveOrdersCount();
    const availableProductsCount = await fetchAvailableProductsCount();
    const allUsersCount = await fetchUsersCount();
    const allCustomersCount = await fetchCustomersCount();
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Welcome back, <span className="text-blue-100">{session?.user?.name}</span>
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                <DateTimeLive />
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                Here's a summary of your business metrics and key performance indicators. Monitor your store activity in real-time.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>

            <DashboardMetrics
                productsCount={productsCount}
                availableProductsCount={availableProductsCount}
                activeOrdersCount={activeOrdersCount}
                usersCount={allUsersCount}
                customersCount={allCustomersCount}
            />
        </div>
    );
}
