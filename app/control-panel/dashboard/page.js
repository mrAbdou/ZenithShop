// app/control-panel/dashboard/page.js
import Image from "next/image";
import { auth } from "@/lib/auth";
import DateTimeLive from "@/components/DateTimeLive";
import LogoutButton from "@/components/LogoutButton";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardMetrics from "@/components/DashboardMetrics";

const getAllProductsCount = async () => {
    const productsData = await graphqlFetch(`query { productsCount }`);
    const productsCount = productsData?.productsCount ?? 0;
    return productsCount;
}

const getActiveOrdersCount = async () => {
    const ordersData = await graphqlFetch(`query { activeOrdersCount }`);
    const activeOrdersCount = ordersData?.activeOrdersCount ?? 0;
    return activeOrdersCount;
}

const getAvailableProductsCount = async () => {
    const productsData = await graphqlFetch(`query { availableProductsCount }`);
    const availableProductsCount = productsData?.allProductsCount ?? 0;
    return availableProductsCount;
}

const getAllUsersCount = async () => {
    const usersData = await graphqlFetch(`query { allUsersCount }`);
    const allUsersCount = usersData?.allUsersCount ?? 0;
    return allUsersCount;
}

const getAllCustomersCount = async () => {
    const customersData = await graphqlFetch(`query { customersCount }`);
    const allCustomersCount = customersData?.customersData ?? 0;
    return allCustomersCount;
}
/**
 * Fetch GraphQL data with cookie forwarding to preserve better-auth session.
 */
const graphqlFetch = async (query) => {
    try {
        // Get cookie header from the incoming request
        const cookieHeader = (await headers()).get("cookie");
        const response = await fetch(process.env.NEXT_PUBLIC_GQL_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
            cache: "no-store",
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            console.error(`GraphQL fetch failed with status ${response.status}`);
            return null;
        }
        const json = await response.json();
        if (json.errors) {
            console.error("GraphQL errors:", json.errors);
            return null;
        }
        return json.data;
    } catch (error) {
        console.error("GraphQL fetch error:", error);
        return null;
    }
};

export default async function ControlPanelDashboardPage() {
    // Get session from better-auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session?.user?.role !== Role.ADMIN) {
        redirect("/");
        return null; // safety
    }

    // Fetch metrics

    const productsCount = await getAllProductsCount();
    const activeOrdersCount = await getActiveOrdersCount();
    const availableProductsCount = await getAvailableProductsCount();
    const allUsersCount = await getAllUsersCount();
    const allCustomersCount = await getAllCustomersCount();

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
                availableProductsCount={productsCount}
                activeOrdersCount={activeOrdersCount}
                productsCount={availableProductsCount}
                usersCount={allUsersCount}
                customersCount={allCustomersCount}
            />
        </div>
    );
}
