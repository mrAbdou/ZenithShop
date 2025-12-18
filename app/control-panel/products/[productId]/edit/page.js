import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { fetchProduct } from "@/services/products.server";
import UpdateProductForm from "@/components/admin/UpdateProductForm";
import Link from "next/link";

export default async function EditProduct({ params }) {
    const h = await headers();
    const session = await auth.api.getSession({
        headers: h
    });
    const cookieHeader = h.get('cookie');
    if (!(session?.user?.role === 'ADMIN')) {
        return redirect('/');
    }
    const { productId } = await params;
    if (!productId || typeof productId !== 'string') {
        notFound();
    }
    const product = await fetchProduct(productId, cookieHeader);
    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Modern Gradient Header */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full opacity-5"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            {/* Back Button */}
                            <Link
                                href={`/control-panel/products/${productId}`}
                                className="inline-flex items-center text-orange-100 hover:text-white mb-6 transition-colors duration-200 group"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Product Details
                            </Link>

                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Edit Product
                            </h1>
                            <p className="text-orange-100 text-lg font-medium mb-4">
                                Modify product information and settings
                            </p>
                            <p className="text-orange-50 max-w-2xl">
                                Update the product details, pricing, and inventory information. Changes will be reflected across your entire e-commerce platform.
                            </p>
                        </div>

                        {/* Product Quick Info */}
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6 text-orange-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <p className="text-2xl font-bold text-white">{product.id.slice(-8)}</p>
                                    </div>
                                    <p className="text-orange-100 text-sm">Product ID</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 min-w-[120px]">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${product.qteInStock > 10 ? 'bg-green-400' :
                                        product.qteInStock > 0 ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}></div>
                                    <div>
                                        <p className="text-white font-semibold">{product.qteInStock}</p>
                                        <p className="text-orange-100 text-xs">Current Stock</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto">
                <UpdateProductForm initialData={product} />
            </div>
        </div>
    );
}
