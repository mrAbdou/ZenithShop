'use client';

import { useCategories } from "@/hooks/categories";
import { useProduct, useUpdateProduct } from "@/hooks/products";
import { UpdateProductSchema } from "@/lib/schemas/product.schema";
import { validateImage } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n/context";

export default function UpdateProductForm({ productId, initialCategories }) {
    const router = useRouter();
    const { t } = useTranslation();
    const { data: categories } = useCategories({}, initialCategories);
    const { data: product, isLoading } = useProduct(productId);
    const { mutateAsync: updateProductAsync } = useUpdateProduct(productId);

    const { register, handleSubmit, reset, formState: { isSubmitting, isValid, errors, isDirty } } = useForm({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            qteInStock: product?.qteInStock || 0,
            categoryId: product?.category?.id || '',
            images: product?.images || []
        },
        resolver: zodResolver(UpdateProductSchema),
        mode: 'onChange',
    });

    // Image management state
    const [existingImagesToKeep, setExistingImagesToKeep] = useState(product?.images || []);
    const [newImagesToUpload, setNewImagesToUpload] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [imageValidationErrors, setImageValidationErrors] = useState([]);


    useEffect(() => {
        if (product) {
            setExistingImagesToKeep(product?.images || []);
            reset({
                name: product?.name,
                description: product?.description,
                price: product?.price,
                qteInStock: product?.qteInStock,
                categoryId: product?.category?.id,
            });
        }
    }, [product, reset]);

    // Image handling functions
    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            // Clear previous validation errors
            setImageValidationErrors([]);

            // Check total images limit (existing + new)
            if (existingImagesToKeep.length + files.length > 10) {
                setImageValidationErrors([t('admin.products.maxImagesError')]);
                return;
            }

            // Validate each file
            const validFiles = [];
            const validPreviews = [];
            const validationErrors = [];

            for (const file of files) {
                try {
                    // Validate file (throws error if invalid)
                    validateImage(file);

                    validFiles.push(file);

                    // Create preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setNewImagePreviews(prev => [...prev, e.target.result]);
                    };
                    reader.readAsDataURL(file);
                } catch (validationError) {
                    // Collect validation errors for display
                    validationErrors.push(`${file.name}: ${validationError.message}`);
                }
            }

            // Set validation errors if any occurred
            if (validationErrors.length > 0) {
                setImageValidationErrors(validationErrors);
            }

            // Add valid files to state
            if (validFiles.length > 0) {
                setNewImagesToUpload(prev => [...prev, ...validFiles]);
            }
        }
    };

    const removeNewImage = (index) => {
        const newSelectedImages = newImagesToUpload.filter((_, i) => i !== index);
        const newPreviews = newImagePreviews.filter((_, i) => i !== index);

        setNewImagesToUpload(newSelectedImages);
        setNewImagePreviews(newPreviews);
    };

    const removeExistingImage = (index) => {
        const newSelectedImages = existingImagesToKeep.filter((_, i) => i !== index);

        setExistingImagesToKeep(newSelectedImages);
    };

    const onSubmit = async (data) => {
        try {
            // Prepare product data with new images
            const productData = {
                name: data.name,
                description: data.description,
                price: data.price,
                qteInStock: data.qteInStock,
                categoryId: data.categoryId,
                existingImagesToKeep: existingImagesToKeep,
                newImagesToUpload: newImagesToUpload
            };

            await updateProductAsync(productData, {
                onSuccess: () => {
                    toast.success(t('admin.products.productUpdated'));
                    router.push('/control-panel/products');
                },
                onError: (error) => {
                    toast.error(error?.message || t('admin.products.deleteFailed'));
                }
            });
        } catch (error) {
            toast.error(t('admin.products.deleteFailed'));
        }
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

                                {/* Category Select Skeleton */}
                                <div className="relative">
                                    <div className="h-4 bg-gray-200 rounded w-36 mb-3 animate-pulse"></div>
                                    <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
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
                                        <h3 className="text-xl font-bold text-gray-900">{t('admin.products.productIdentity')}</h3>
                                        <p className="text-gray-600 text-sm">{t('admin.products.productIdentityDesc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Name */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {t('admin.products.productName')}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder={t('admin.products.enterProductName')}
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
                                    {t('admin.products.productDescription')}
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder={t('admin.products.describeProduct')}
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

                            {/* Product Category */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {t('admin.products.productCategory')}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        {...register('categoryId')}
                                        disabled={isSubmitting}
                                        className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none appearance-none ${errors.categoryId
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                            : 'border-green-500 focus:border-green-500 focus:ring-green-100 bg-green-50 text-green-700 hover:border-green-600'
                                            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">{t('admin.products.selectCategory')}</option>
                                        {categories?.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.categoryId && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.categoryId.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Product Images Section */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 rounded-2xl border border-purple-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{t('admin.products.productImage')}</h3>
                                        <p className="text-gray-600 text-sm">{t('admin.products.manageProductPhotos')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* All Images Display */}
                            {(product?.images && product.images.length > 0) || newImagePreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {t('admin.products.productImage')} ({(product?.images?.length || 0) + newImagePreviews.length}/10)
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {/* Existing Images */}
                                        {existingImagesToKeep && existingImagesToKeep.map((image, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                                                    <img
                                                        src={image}
                                                        alt={`Existing product image ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    title={t('admin.products.removeExistingImage')}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <div className="absolute bottom-1 left-1 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                    {t('admin.products.existing')}
                                                </div>
                                            </div>
                                        ))}

                                        {/* New Image Previews */}
                                        {newImagePreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-purple-200 bg-gray-100 shadow-md">
                                                    <img
                                                        src={preview}
                                                        alt={`New product preview ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    disabled={isSubmitting}
                                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <div className="absolute bottom-1 left-1 bg-purple-600 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                    {t('admin.products.new')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status Message */}
                                    {newImagesToUpload.length > 0 && (
                                        <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {t('admin.products.newImagesSelected').replace('{count}', newImagesToUpload.length)}
                                        </p>
                                    )}
                                </div>
                            ) : null}

                            {/* Upload New Images - Only show if there's space */}
                            {((product?.images?.length || 0) + newImagePreviews.length) < 10 && (
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {t('admin.products.addNewImages').replace('{count}', 10 - ((product?.images?.length || 0) + newImagePreviews.length))}
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageSelect}
                                            disabled={isSubmitting}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            id="image-upload"
                                        />
                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isSubmitting
                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                            : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                                            }`}>
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <div className="text-lg font-semibold text-gray-700 mb-2">{t('admin.products.uploadImage')}</div>
                                                <p className="text-gray-500 text-sm mb-4">{t('admin.products.dragAndDrop')}</p>
                                                <p className="text-xs text-gray-400">{t('admin.products.supportedFormatsShort')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Validation Errors */}
                                    {imageValidationErrors.length > 0 && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-start">
                                                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-red-800 mb-2">{t('admin.products.uploadErrors')}</h4>
                                                    <ul className="text-sm text-red-700 space-y-1">
                                                        {imageValidationErrors.map((error, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <span className="text-red-500 mr-2">•</span>
                                                                {error}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                        <h3 className="text-xl font-bold text-gray-900">{t('admin.products.pricingInventory')}</h3>
                                        <p className="text-gray-600 text-sm">{t('admin.products.pricingInventoryDesc')}</p>
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
                                        {t('admin.products.productPrice')}
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
                                            {t('admin.products.enterPriceUSD')}
                                        </p>
                                    )}
                                </div>

                                {/* Stock Input */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        {t('admin.products.stockQuantity')}
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
                                            {t('admin.products.currentInventoryCount')}
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
                                        <h3 className="text-xl font-bold text-gray-900">{t('admin.products.updateActions')}</h3>
                                        <p className="text-gray-600 text-sm">{t('admin.products.saveOrDiscard')}</p>
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
                                    <span>{t('admin.products.cancelChanges')}</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isValid || (!isDirty && newImagesToUpload.length === 0 && existingImagesToKeep.length === (product?.images?.length || 0))}
                                    className={`px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 min-w-[280px] ${isSubmitting || !isValid || (!isDirty && newImagesToUpload.length === 0 && existingImagesToKeep.length === (product?.images?.length || 0))
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
                                            <span>{t('admin.products.updatingProduct')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{t('admin.products.updateProduct')}</span>
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
