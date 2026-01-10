'use client';
import { useProductContext } from '@/context/ProductContext';
import { filteringInfiniteProductSchema } from '@/lib/schemas/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCategories } from '@/hooks/categories';

export default function CustomerProductsFilters({ initialCategories }) {
    //TODO: you need to send graphql request to get the defined categories from the DB
    const { filters, setFilteringProps } = useProductContext();
    const { data: categories } = useCategories({}, initialCategories);
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        defaultValues: {
            searchQuery: filters.searchQuery,
            categoryId: filters.categoryId,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice
        },
        resolver: zodResolver(filteringInfiniteProductSchema),
        mode: 'onChange'
    });

    useEffect(() => {
        reset({
            searchQuery: filters.searchQuery,
            categoryId: filters.categoryId,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice
        });
    }, [filters]);


    const onSubmit = (data) => {
        setFilteringProps({
            searchQuery: data.searchQuery,
            categoryId: data.categoryId,
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
        });
    };

    const handleReset = () => {
        reset({
            searchQuery: '',
            categoryId: '',
            minPrice: '',
            maxPrice: ''
        });
        setFilteringProps({
            searchQuery: '',
            categoryId: '',
            minPrice: '',
            maxPrice: '',
            stock: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Filter Products</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            {...register('searchQuery')}
                            type="text"
                            id="searchQuery"
                            placeholder="Search products..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.searchQuery && <p className="text-red-500 text-xs mt-1">{errors.searchQuery.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            {...register('categoryId')}
                            id="categoryId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Min Price
                        </label>
                        <input
                            {...register('minPrice')}
                            type="number"
                            id="minPrice"
                            placeholder="0"
                            step='0.01'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.minPrice && <p className="text-red-500 text-xs mt-1">{errors.minPrice.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Max Price
                        </label>
                        <input
                            {...register('maxPrice')}
                            type="number"
                            id="maxPrice"
                            placeholder="1000"
                            step='0.01'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.maxPrice && <p className="text-red-500 text-xs mt-1">{errors.maxPrice.message}</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>
        </div>
    );
}
