import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ProductsTable from "@/components/admin/ProductsTable";
import { fetchProducts, fetchProductsCount } from "@/services/products.server";
import { LIMIT } from "@/lib/constants";
export const metadata = {
    title: "Products Management | ZenithShop Admin",
    description: "Admin interface for managing ZenithShop product catalog. Add, edit, delete, and organize products efficiently with real-time updates and analytics.",
}
export default async function ProductsManagementPage() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const session = await auth.api.getSession({
        headers: h
    });

    if (!session || !(session?.user?.role === Role.ADMIN)) return redirect("/");
    const products = await fetchProducts(LIMIT, 0, cookieHeader);
    const totalProducts = await fetchProductsCount(cookieHeader);
    console.log(products);
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Products Management
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                Manage your product catalog efficiently
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                Here you can view, add, update, and delete products in your store. Each change is tracked and synchronized across your e-commerce platform.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">{totalProducts ?? 0}</p>
                                    <p className="text-blue-100 text-sm">Total Products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductsTable initialData={products} />

        </div>
    )
}
