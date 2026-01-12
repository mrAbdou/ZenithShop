'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryCreateSchema } from "@/lib/schemas/category.schema";
import { useCreateCategory } from "@/hooks/categories";
import { toast } from "react-hot-toast";

export default function AddCategoryForm() {
    const { mutateAsync: createCategoryAsync, isPending } = useCreateCategory();
    const { handleSubmit, register, reset, formState: { isSubmitting, isValid, errors, isDirty } } = useForm({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(CategoryCreateSchema),
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        try {
            await createCategoryAsync(data, {
                onSuccess: (responseData) => {
                    if (responseData?.id) {
                        toast.success("Category created successfully!");
                        reset();
                    } else {
                        toast.error("Category created but response invalid");
                    }
                },
                onError: (error) => {
                    toast.error(error?.message || 'Failed to create category');
                }
            });
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    const isLoading = isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 shadow">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Name
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        {...register("name")}
                        disabled={isLoading}
                        type="text"
                        placeholder="Enter category name..."
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 transition-all duration-300 outline-none ${errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100 bg-white'
                            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !isValid || !isDirty}
                        className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold ${isLoading || !isValid || !isDirty
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:shadow-lg'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Category'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}