'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFilterSchema } from "@/lib/schemas/category.schema";
import { useEffect } from "react";
import { useCategoryContext } from "@/context/CategoryContext";

// Define the schema for category filtering

export default function CategoriesFilters() {
    const { filters, setFilteringProps } = useCategoryContext();
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        defaultValues: {
            searchQuery: filters?.searchQuery,
        },
        resolver: zodResolver(CategoryFilterSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        reset({
            searchQuery: filters?.searchQuery,
        })
    }, [filters]);

    const onSubmit = (data) => {
        setFilteringProps(data);
    };

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 md:p-8 mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Filter Categories</h2>
                        <p className="text-sm text-gray-500 mt-1">Search and filter your category list</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <label htmlFor="searchQuery" className="block text-sm font-semibold text-gray-700">
                            Search Categories
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="searchQuery"
                                type="text"
                                {...register("searchQuery")}
                                placeholder="Search by name..."
                                className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>
                        {errors.searchQuery && (
                            <p className="text-red-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                                <span className="text-lg leading-none">⚠</span>
                                {errors.searchQuery.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
                    <p className="text-sm text-gray-500">
                        Apply filters to refine your category search
                    </p>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 focus:outline-hidden focus:ring-3 focus:ring-purple-500/30 active:bg-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Apply Filters
                    </button>
                </div>
            </form>
        </section>
    );
}