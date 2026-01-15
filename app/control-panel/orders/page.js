// start components import ---------------------------------------
import OrdersManagement from "@/components/admin/OrdersManagement";
// end components import -----------------------------------------

// start better auth import --------------------------------------
import { auth } from "@/lib/auth";
// end better auth import ----------------------------------------

// start services import -----------------------------------------
import { fetchOrders, fetchOrdersCount } from "@/services/orders.server"
// end services import -------------------------------------------

// start prisma import -------------------------------------------
import { Role } from "@prisma/client";
// end prisma import ---------------------------------------------

// start next import ---------------------------------------------
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { PAGINATION_MIN_LIMIT } from "@/lib/constants";
// end next import -----------------------------------------------

// start i18n import ---------------------------------------------
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";
// end i18n import -----------------------------------------------

export async function generateMetadata() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);

    return {
        title: dictionary.admin.orders.pageTitle,
        description: dictionary.admin.orders.pageDescription,
    };
}
export default async function OrdersManagementPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({
        headers: h
    });
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);

    let error = '';
    if (!session || session.user.role !== Role.ADMIN) {
        return redirect("/");
    }
    let orders = [];
    let ordersCount = 0;
    try {
        // filters has a default value in fetchOrders so there is no need to pass it
        const variables = { currentPage: 1, limit: PAGINATION_MIN_LIMIT };
        orders = await fetchOrders(variables, cookieHeader);
        ordersCount = await fetchOrdersCount(variables, cookieHeader);
    } catch (error) {
        error = error.message;
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {dictionary.admin.orders.management}
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                {dictionary.admin.orders.manageOrders}
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                {dictionary.admin.orders.trackOrders}
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">{ordersCount}</p>
                                    <p className="text-blue-100 text-sm">{dictionary.admin.orders.total || "Total Orders"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {/* Search and Filter Partition */}
            <OrdersManagement orders={orders} dictionary={dictionary} locale={locale} />
        </div>
    )
}
