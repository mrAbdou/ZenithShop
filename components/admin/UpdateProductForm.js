'use client';

import { useProduct } from "@/hooks/products";
import { UpdateProductSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, FormInput, FormTextArea } from "../UX";

export default function UpdateProductForm({ initialData }) {
    const { data: product } = useProduct(initialData.id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
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
            form.reset({
                name: product?.name,
                description: product?.description,
                price: product?.price,
                qteInStock: product?.qteInStock
            });
        }
    }, [product]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log('Updating product:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Here you would typically call your update mutation
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form form={form} onSubmit={onSubmit} showHeader={false}>
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
                        </label>
                        <div className="relative">
                            <FormInput
                                name="name"
                                placeholder="Enter product name..."
                                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
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
                            <FormTextArea
                                name="description"
                                placeholder="Describe your product in detail..."
                                rows={5}
                                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none"
                            />
                            <div className="absolute left-4 top-4">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </div>
                        </div>
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
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-bold text-lg">
                                    $
                                </div>
                                <FormInput
                                    type="number"
                                    name="price"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="pl-8 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-center"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Enter price in USD
                            </p>
                        </div>

                        {/* Stock Input */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Stock Quantity
                            </label>
                            <div className="relative">
                                <FormInput
                                    type="number"
                                    name="qteInStock"
                                    placeholder="0"
                                    min="0"
                                    className="pl-12 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-center"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Current inventory count
                            </p>
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

                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            type="button"
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Changes
                        </button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center min-w-[250px] ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Updating...</span>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Update Product</span>
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    );
}
