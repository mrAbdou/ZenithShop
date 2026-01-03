'use client';

import { useOrder, useUpdateOrder } from "@/hooks/orders";
import { updateOrderSchema } from "@/lib/schemas/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UpdateOrderForm({ id }) {
    const router = useRouter();
    const { data: order, isLoading } = useOrder(id);
    const { handleSubmit, register, reset, watch, formState: { isSubmitting, isValid, isDirty, errors } } = useForm({
        defaultValues: {
            status: order?.status || OrderStatus.PENDING,
        },
        resolver: zodResolver(updateOrderSchema),
        mode: "onChange",
    });

    useEffect(() => {
        reset({
            status: order?.status,
        });
    }, [order]);

    const { mutateAsync: updateOrderAsync } = useUpdateOrder(id);
    const onSubmit = (data) => {
        updateOrderAsync(data, {
            onSuccess: () => {
                reset();
                toast.success("Order updated successfully");
                router.push('/control-panel/orders');
            },
            onError: (error) => {
                toast.error(error.message ?? 'Failed to update order');
            }
        });
    };

    // Watch the current status value for dynamic styling
    const currentStatus = watch('status');

    const orderStatusOptions = [
        { value: OrderStatus.PENDING, label: "Pending", color: "gray", icon: "⏳" },
        { value: OrderStatus.CONFIRMED, label: "Confirmed", color: "blue", icon: "✅" },
        { value: OrderStatus.SHIPPED, label: "Shipped", color: "purple", icon: "🚚" },
        { value: OrderStatus.DELIVERED, label: "Delivered", color: "green", icon: "📦" },
        { value: OrderStatus.CANCELLED, label: "Cancelled", color: "red", icon: "❌" },
        { value: OrderStatus.RETURNED, label: "Returned", color: "orange", icon: "↩️" },
    ];

    // Get status styling based on current selection
    const getStatusStyling = (status) => {
        const statusConfig = orderStatusOptions.find(opt => opt.value === status);
        if (!statusConfig) return { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-700' };

        const colorMap = {
            gray: { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' },
            blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
            green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
            red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' },
            orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' }
        };

        return colorMap[statusConfig.color] || colorMap.gray;
    };

    // Loading skeleton component
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="space-y-12">
                            {/* Header Skeleton */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-2xl border border-amber-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3 animate-pulse">
                                        <div className="w-5 h-5 bg-amber-200 rounded"></div>
                                    </div>
                                    <div>
                                        <div className="h-6 bg-amber-200 rounded w-48 mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-amber-100 rounded w-64 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Select Skeleton */}
                            <div className="relative">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                                <div className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                            </div>

                            {/* Action Section Skeleton */}
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
                                <div className="h-16 bg-blue-200 rounded-xl w-48 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentStatusStyling = getStatusStyling(currentStatus);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
                    <div className="space-y-12">
                        {/* Order Status Section */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-2xl border border-amber-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Order Status Update</h3>
                                        <p className="text-gray-600 text-sm">Change the processing stage of this order</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order ID Display */}
                            <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-700">Order ID:</span>
                                    </div>
                                    <span className="font-mono text-sm bg-white px-3 py-1 rounded-lg border border-gray-300 text-gray-900">
                                        {order?.id?.slice(-8) || 'Loading...'}
                                    </span>
                                </div>
                            </div>

                            {/* Status Select */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Order Status
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="status"
                                        name="status"
                                        disabled={isSubmitting}
                                        {...register('status')}
                                        className={`w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl focus:ring-4 transition-all duration-300 outline-none appearance-none cursor-pointer ${errors.status
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100 bg-red-50 text-red-700'
                                            : `${currentStatusStyling.border} focus:border-${orderStatusOptions.find(opt => opt.value === currentStatus)?.color || 'gray'}-500 focus:ring-${orderStatusOptions.find(opt => opt.value === currentStatus)?.color || 'gray'}-100 ${currentStatusStyling.bg} ${currentStatusStyling.text} hover:border-${orderStatusOptions.find(opt => opt.value === currentStatus)?.color || 'gray'}-600`
                                            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        {orderStatusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.icon} {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.status && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.status.message}
                                    </p>
                                )}
                                {!errors.status && currentStatus && (
                                    <div className={`mt-2 text-xs font-medium flex items-center ${currentStatusStyling.text.replace('text-', 'text-')}`}>
                                        <span className="mr-1">
                                            {orderStatusOptions.find(opt => opt.value === currentStatus)?.icon}
                                        </span>
                                        Current status: {orderStatusOptions.find(opt => opt.value === currentStatus)?.label}
                                    </div>
                                )}
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
                                        <p className="text-gray-600 text-sm">Confirm the order status change</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-end pt-4">
                                <button
                                    onClick={() => reset(order)}
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
                                            <span>Updating Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Update Order Status</span>
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
