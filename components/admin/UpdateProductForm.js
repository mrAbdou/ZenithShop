'use client';

import { useProduct, useUpdateProduct } from "@/hooks/products";
import { UpdateProductSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UpdateProductForm({ productId }) {
    const router = useRouter();
    const { data: product, isLoading } = useProduct(productId);
    const { mutateAsync: updateProductAsync } = useUpdateProduct(productId);
    const { register, handleSubmit, reset, formState: { isSubmitting, isValid, errors, isDirty } } = useForm({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            qteInStock: product?.qteInStock || 0
        },
        resolver: zodResolver(UpdateProductSchema),
        mode: 'onChange',
    });
    useEffect(() => {
        if (product) {
            reset({
                name: product?.name,
                description: product?.description,
                price: product?.price,
                qteInStock: product?.qteInStock
            });
        }
    }, [product]);

    const onSubmit = async (data) => {
        await updateProductAsync(data, {
            onSuccess: () => {
                toast.success('Product updated successfully');
                router.push('/control-panel/products');
            },
            onError: (error) => {
                toast.error(error?.message || 'Failed to update product');
            }
        });
    };

    // Loading skeleton component
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="space-y-12">
                            {/* Product Identity Section Skeleton */}
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-2xl border border-blue-100">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                            <div className="w-5 h-5 bg-blue-200 rounded"></div>
                                        </div>
                                        <div>
                                            <div className="h-6 bg-blue-200 rounded w-48 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-blue-100 rounded w-64 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Name Input Skeleton */}
                                <div className="relative">
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                                    <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                                </div>

                                {/* Description Input Skeleton */}
                                <div className="relative">
                                    <div className="h-4 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                                    <div className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                                </div>
                            </div>

                            {/* Pricing & Inventory Section Skeleton */}
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-2xl border border-green-100">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                            <div className="w-5 h-5 bg-green-200 rounded"></div>
                                        </div>
                                        <div>
                                            <div className="h-6 bg-green-200 rounded w-48 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-green-100 rounded w-64 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Price Input Skeleton */}
                                    <div className="relative">
                                        <div className="h-4 bg-gray-200 rounded w-28 mb-3 animate-pulse"></div>
                                        <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                                    </div>

                                    {/* Stock Input Skeleton */}
                                    <div className="relative">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                                        <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section Skeleton */}
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 rounded-2xl border border-indigo-100">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                            <div className="w-5 h-5 bg-indigo-200 rounded"></div>
                                        </div>
                                        <div>
                                            <div className="h-6 bg-indigo-200 rounded w-36 mb-2 animate-pulse"></div>
                                            <div className="h-4 bg-indigo-100 rounded w-48 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 justify-end pt-4">
                                    <div className="h-16 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
                                    <div className="h-16 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
                    <div className="space-y-12">
                        {/* Product Identity Section */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-2xl border border-blue-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Product Identity</h3>
                                        <p className="text-gray-600 text-sm">Basic information and description</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Product Name
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter product name..."
                                        {...register('name')}
                                        disabled={isSubmitting}
                                        className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none ${errors.name
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                            : 'border-green-500 focus:border-green-500 focus:ring-green-100 bg-green-50 text-green-700 hover:border-green-600'
                                            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Product Description */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Product Description
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your product in detail..."
                                        rows={5}
                                        {...register('description')}
                                        disabled={isSubmitting}
                                        className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none resize-none ${errors.description
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                            : 'border-green-500 focus:border-green-500 focus:ring-green-100 bg-green-50 text-green-700 hover:border-green-600'
                                            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                    <div className="absolute left-4 top-4">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Pricing & Inventory Section */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-2xl border border-green-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Pricing & Inventory</h3>
                                        <p className="text-gray-600 text-sm">Set price and manage stock levels</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Price Input */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Product Price
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-lg ${errors.price ? 'text-red-600' : 'text-green-600'}`}>
                                            $
                                        </div>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            {...register('price')}
                                            disabled={isSubmitting}
                                            className={`w-full pl-8 pr-4 py-4 text-xl font-bold border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none text-center ${errors.price
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                                : 'border-green-500 focus:border-green-500 focus:ring-green-100 bg-green-50 text-green-700 hover:border-green-600'
                                                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.price.message}
                                        </p>
                                    )}
                                    {!errors.price && (
                                        <p className="text-xs text-green-600 mt-2 flex items-center">
                                            <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Enter price in USD
                                        </p>
                                    )}
                                </div>

                                {/* Stock Input */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Stock Quantity
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="qteInStock"
                                            name="qteInStock"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            {...register('qteInStock')}
                                            disabled={isSubmitting}
                                            className={`w-full pl-12 pr-4 py-4 text-xl font-bold border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none text-center ${errors.qteInStock
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                                : 'border-green-500 focus:border-green-500 focus:ring-green-100 bg-green-50 text-green-700 hover:border-green-600'
                                                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.qteInStock && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errors.qteInStock.message}
                                        </p>
                                    )}
                                    {!errors.qteInStock && (
                                        <p className="text-xs text-green-500 mt-2 flex items-center">
                                            <svg className="w-3 h-3 text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Current inventory count
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 rounded-2xl border border-indigo-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Update Actions</h3>
                                        <p className="text-gray-600 text-sm">Save your changes or discard them</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-end pt-4">
                                <button
                                    onClick={() => reset(product)}
                                    type="button"
                                    disabled={isSubmitting}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Cancel Changes</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid || !isDirty}
                                    className={`px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 min-w-[280px] ${isSubmitting || !isValid || !isDirty
                                        ? 'opacity-60 cursor-not-allowed'
                                        : 'hover:shadow-2xl'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Updating Product...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Update Product</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
