'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductSchema } from "@/lib/zodSchemas";
import { useAddProduct } from "@/lib/tanStackHooks/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function AddProductForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            qteInStock: 0,
        },
        resolver: zodResolver(AddProductSchema),
        mode: "onChange",
    });
    const { mutate } = useMutation({
        mutationFn: useAddProduct,
        onSuccess: async ({ data }) => {
            toast.success("Product added successfully");
            await queryClient.setQueryData({
                queryKey: ["products"],
                data: (prevData) => {
                    if (!prevData) return [data];
                    return [...prevData, data];
                }
            });
            await queryClient.invalidateQueries({
                queryKey: ["products"]
            });
            router.push("/control-panel/products");
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            reset();
        }
    })

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Add New Product</h2>
                        <p className="text-gray-600">Fill in the details below to add a product to your catalog</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(mutate)} className="space-y-8">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register("name")}
                        placeholder="Enter product name"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-500"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                {/* Description Field */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register("description")}
                        placeholder="Describe your product"
                        rows={4}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-500 resize-none"
                    />
                    {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>

                {/* Price and Quantity Row */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Price Field */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-3">
                            Price ($)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-medium">$</span>
                            </div>
                            <input
                                type="number"
                                id="price"
                                {...register("price")}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-500"
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                        )}
                    </div>

                    {/* Quantity Field */}
                    <div>
                        <label htmlFor="qteInStock" className="block text-sm font-semibold text-gray-800 mb-3">
                            Quantity in Stock
                        </label>
                        <input
                            type="number"
                            id="qteInStock"
                            {...register("qteInStock")}
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-900 placeholder:text-gray-500"
                        />
                        {errors.qteInStock && (
                            <p className="mt-2 text-sm text-red-600">{errors.qteInStock.message}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Product
                        </span>
                    </button>
                </div>
            </form>
        </div>
    )
}
