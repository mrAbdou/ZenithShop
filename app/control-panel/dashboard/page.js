// start components import-----------------------------------------
import DateTimeLive from "@/components/customer/DateTimeLive";
import LogoutButton from "@/components/LogoutButton";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
// end components import-----------------------------------------

// better auth import --------------------------------------------
import { auth } from "@/lib/auth";
// end better auth import ------------------------------------------

// start prisma import -------------------------------------------
import { Role } from "@prisma/client";
// end prisma import ---------------------------------------------

// start next import ---------------------------------------------
import { redirect } from "next/navigation";
import { headers } from "next/headers";
// end next import -----------------------------------------------

// start services import -----------------------------------------
import { fetchCustomersCount, fetchUsersCount } from "@/services/users.server";
import { fetchAvailableProductsCount, fetchProductsCount } from "@/services/products.server";
import { fetchActiveOrdersCount } from "@/services/orders.server";
import { fetchCategoriesCount } from "@/services/categories.server";
// end services import -------------------------------------------

// start i18n import ---------------------------------------------
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
// end i18n import -----------------------------------------------
export async function generateMetadata() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);

    return {
        title: dictionary.meta.adminDashboardTitle,
        description: dictionary.meta.adminDashboardDesc,
    };
}

export default async function ControlPanelDashboardPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({ headers: h });
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    if (!session || session?.user?.role !== Role.ADMIN) {
        redirect("/");
        return null;
    }

    // Fetch metrics
    let productsCount = 0;
    let activeOrdersCount = 0;
    let availableProductsCount = 0;
    let allUsersCount = 0;
    let allCustomersCount = 0;
    let categoriesCount = 0;
    try {
        productsCount = await fetchProductsCount(cookieHeader);
        activeOrdersCount = await fetchActiveOrdersCount(cookieHeader);
        availableProductsCount = await fetchAvailableProductsCount(cookieHeader);
        allUsersCount = await fetchUsersCount(cookieHeader);
        allCustomersCount = await fetchCustomersCount(cookieHeader);
        categoriesCount = await fetchCategoriesCount(cookieHeader);
    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {dictionary.admin.dashboard.title} <span className="text-blue-100">{session?.user?.name}</span>
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                <DateTimeLive />
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                {dictionary.admin.dashboard.subtitle}
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
                categoriesCount={categoriesCount}
            />
        </div>
    );
}
