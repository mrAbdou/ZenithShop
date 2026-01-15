import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetchCategory } from "@/services/categories.server";
import UpdateCategoryForm from "@/components/admin/UpdateCategoryForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata() {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    
    return {
        title: dictionary.admin.categories.pageTitle,
        description: dictionary.admin.categories.pageDescription,
    };
}

export default async function EditCategoryPage({ params }) {
    const locale = await getLocale();
    const dictionary = await getDictionary(locale);
    const h = await headers();
    const session = await auth.api.getSession({
        headers: h
    });
    if (!session || session?.user?.role !== Role.ADMIN) {
        redirect('/');
        return;
    }

    const { categoryId } = await params;
    let category = null;

    try {
        category = await fetchCategory({ id: categoryId }, h.get("cookie"));
        if (!category) {
            redirect('/control-panel/categories');
            return;
        }
    } catch (error) {
        console.error(error);
        redirect('/control-panel/categories');
        return;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Modern Gradient Header */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-5"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                {dictionary.admin.categories.editCategory}
                            </h1>
                            <p className="text-green-100 text-lg font-medium mb-4">
                                {dictionary.admin.categories.organizeCatalog}
                            </p>
                            <p className="text-green-50 max-w-2xl">
                                {dictionary.admin.categories.viewFilterCategories}
                            </p>
                        </div>

                        {/* Category Quick Stats */}
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6 text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <p className="text-2xl font-bold text-white">{category.name}</p>
                                    </div>
                                    <p className="text-green-100 text-sm">{dictionary.admin.categories.editCategory}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Category Form */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow rounded-lg p-8">
                    <UpdateCategoryForm
                        initialCategory={category}
                    />
                </div>
            </div>
        </div>
    );
}