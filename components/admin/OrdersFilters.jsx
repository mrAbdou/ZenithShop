'use client';

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { OrderStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilteredOrdersCountSchema } from "@/lib/schemas/order.schema";
import { useOrderFiltersContext } from "@/context/OrdersFiltersContext";
export default function OrdersFilters() {
    // i used RHF do define a form for filter values , this way i can validate the values using zod schema validation and returned in organized shape (object)
    //TODO: create a zod schema validation for filter values
    //TODO: include the created zod schema validation in useForm and set the mode to onChange
    const { handleSubmit, register, reset, watch, trigger, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            searchQuery: '',
            status: '',
            startDate: '',
            endDate: '',
        },
        resolver: zodResolver(FilteredOrdersCountSchema),
        mode: 'onChange'
    });
    // all available order status options with visual indicators
    const statusOptions = [
        { value: '', label: "📋 All Options", color: "text-gray-700" },
        { value: OrderStatus.PENDING, label: "⏳ Pending", color: "text-yellow-700" },
        { value: OrderStatus.CONFIRMED, label: "✅ Confirmed", color: "text-blue-700" },
        { value: OrderStatus.SHIPPED, label: "🚚 Shipped", color: "text-purple-700" },
        { value: OrderStatus.DELIVERED, label: "📦 Delivered", color: "text-green-700" },
        { value: OrderStatus.CANCELLED, label: "❌ Cancelled", color: "text-red-700" },
        { value: OrderStatus.RETURNED, label: "↩️ Returned", color: "text-orange-700" },
    ];

    // i get the function that it will set the filter values in the context
    const { updateFilters } = useOrderFiltersContext();

    // and here i call the updateFilters function to update the filter values in the context
    // this function is called when i click of apply filters button (submit the form)
    const onSubmit = (data) => {
        updateFilters(data);
    }

    // Watch date fields to trigger cross-field validation
    const watchedStart = watch('startDate');
    const watchedEnd = watch('endDate');
    useEffect(() => {
        if (watchedStart || watchedEnd) {
            trigger('endDate');
        }
    }, [watchedStart, watchedEnd]);

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 mb-6 transition-shadow hover:shadow-md">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Filter Orders</h2>
                <p className="text-sm text-gray-500">Search and filter orders by status and date range</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Search Input */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="searchQuery"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Search
                        </label>
                        <input
                            id="searchQuery"
                            name="searchQuery"
                            {...register('searchQuery')}
                            type="text"
                            placeholder="Order ID or customer name..."
                            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${errors.searchQuery
                                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                        />
                        {errors.searchQuery && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-start gap-1">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.searchQuery.message}</span>
                            </p>
                        )}
                    </div>

                    {/* Status Select */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="status"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Order Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            {...register('status')}
                            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%207l3%203%203-3%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${errors.status
                                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-start gap-1">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.status.message}</span>
                            </p>
                        )}
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="startDate"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            name="startDate"
                            {...register('startDate')}
                            type="datetime-local"
                            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${errors.startDate
                                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                        />
                        {errors.startDate && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-start gap-1">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.startDate.message}</span>
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="endDate"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            End Date
                        </label>
                        <input
                            id="endDate"
                            name="endDate"
                            {...register('endDate')}
                            type="datetime-local"
                            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 ${errors.endDate
                                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                        />
                        {errors.endDate && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-start gap-1">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errors.endDate.message}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Apply Filters
                    </button>

                    {isDirty && (
                        <button
                            type="submit"
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
