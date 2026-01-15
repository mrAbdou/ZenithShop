import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AddProductForm from "@/components/admin/AddProductForm";
import { fetchCategories } from "@/services/categories.server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    
    return {
        title: dictionary.admin.products.pageTitle,
        description: dictionary.admin.products.pageDescription,
    };
}

export default async function AddProduct() {
    const h = await headers();
    const cookieHeader = h.get("cookie");
    const categories = await fetchCategories({}, cookieHeader);

    const session = await auth.api.getSession({
        headers: h
    });

    if (!session || !(session?.user?.role === Role.ADMIN)) {
        redirect("/");
        return;
    }
    
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {dictionary.admin.products.addProduct}
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                {dictionary.admin.products.manageEfficiently}
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                {dictionary.admin.products.viewAddUpdate}
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">+1</p>
                                    <p className="text-blue-100 text-sm">{dictionary.admin.products.addProduct}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <AddProductForm initialCategories={categories} />
            </div>
        </div>
    );
}
