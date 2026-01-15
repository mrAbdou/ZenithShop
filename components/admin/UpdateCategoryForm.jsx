'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryUpdateSchema } from "@/lib/schemas/category.schema";
import { useCategory, useUpdateCategory } from "@/hooks/categories";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

export default function UpdateCategoryForm({ initialCategory }) {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: category } = useCategory(initialCategory.id, initialCategory);
    const { mutateAsync: updateCategoryAsync, isPending } = useUpdateCategory();
    const { handleSubmit, register, reset, formState: { isSubmitting, isValid, errors, isDirty } } = useForm({
        defaultValues: {
            id: initialCategory.id,
            name: initialCategory.name,
        },
        resolver: zodResolver(CategoryUpdateSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (category) {
            reset({
                id: category.id,
                name: category.name,
            });
        }
    }, [category, reset]);

    const onSubmit = async (data) => {
        try {
            const variables = {
                id: category.id,
                ...data
            }
            await updateCategoryAsync(variables, {
                onSuccess: (responseData) => {
                    if (responseData?.id) {
                        toast.success(t('admin.categories.categoryUpdated'));
                        router.push('/control-panel/categories');
                    } else {
                        toast.error(t('admin.categories.categoryUpdatedInvalid'));
                    }
                },
                onError: (error) => {
                    toast.error(error?.message || t('admin.categories.updateFailed'));
                }
            });
        } catch (error) {
            toast.error(t('admin.categories.unexpectedError'));
        }
    };

    const isLoading = isPending || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('admin.categories.categoryName')}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                    {...register("name")}
                    disabled={isLoading}
                    type="text"
                    placeholder={t('admin.categories.enterCategoryName')}
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

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !isValid || !isDirty}
                    className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold ${isLoading || !isValid || !isDirty
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
                            {t('admin.categories.updating')}
                        </>
                    ) : (
                        t('admin.categories.updateCategory')
                    )}
                </button>
            </div>
        </form>
    );
}