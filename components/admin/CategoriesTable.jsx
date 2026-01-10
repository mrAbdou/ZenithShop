'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useCategoryContext } from '@/context/CategoryContext';
import { useCategories, useCountFilteredCategories } from '@/hooks/categories';
export default function CategoriesTable({ initialCategories, initialCategoriesCount }) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
    };
    const { filters } = useCategoryContext();
    const { data: categories } = useCategories(filters, initialCategories);
    const { data: totalCategories } = useCountFilteredCategories(filters, initialCategoriesCount);
    const totalPages = useMemo(() =>
        totalCategories && totalCategories > 0 ? Math.ceil(totalCategories / filters.limit) : 1,
        [totalCategories, filters.limit]
    );

    const getVisiblePages = useCallback((currentPage, totalPages, maxVisible = 7) => {
        const pages = [];

        // Always show first page
        if (totalPages >= 1) pages.push(1);

        // Calculate range around current page
        let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, start + maxVisible - 1);

        // Adjust if near start/end
        if (end - start + 1 < maxVisible) {
            start = Math.max(2, end - maxVisible + 1);
        }

        // Add ellipsis before range if needed
        if (start > 2) pages.push('...');

        // Add page range
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }

        // Add ellipsis after range if needed
        if (end < totalPages - 1) pages.push('...');

        // Always show last page
        if (totalPages > 1) pages.push(totalPages);

        return pages.filter((page, index, arr) =>
            // Remove consecutive ellipsis
            !(page === '...' && arr[index - 1] === '...')
        );
    }, [totalPages, filters.currentPage]);

    const getHeaderText = useCallback((label, field) => {
        if (filters.sortBy === field) {
            return filters.sortDirection === 'asc' ? `${label} ↑` : filters.sortDirection === 'desc' ? `${label} ↓` : `${label} ⇅`;
        }
        return `${label} ⇅`;
    }, [filters.sortBy, filters.sortDirection]);

    const onHeaderClick = (field) => {
        let sortBy;
        let sortDirection;
        if (filters.sortBy === field) {
            if (filters.sortDirection === 'desc') {
                sortDirection = 'asc';
            } else if (filters.sortDirection === 'asc') {
                sortDirection = '';
                sortBy = '';
            } else {
                sortDirection = 'desc';
            }
        } else {
            sortDirection = 'desc';
        }
        sortBy = sortBy !== undefined ? sortBy : field;
        setSortingFilters({ sortBy, sortDirection });
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => onHeaderClick('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Category ID', 'id')}
                            </th>
                            <th onClick={() => onHeaderClick('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Name', 'name')}
                            </th>
                            <th onClick={() => onHeaderClick('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Created', 'createdAt')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories?.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {category.id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(category.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/control-panel/products?categoryId=${category.id}`}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            View Products
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!categories || categories.length === 0) && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing {((filters.currentPage - 1) * filters.limit) + 1} to {Math.min(filters.currentPage * filters.limit, totalCategories || 0)} of {totalCategories || 0} categories
                </div>
                <div className="flex items-center gap-2">
                    <select
                        onChange={(e) => setPaginationLimit(parseInt(e.target.value))}
                        value={filters.limit}
                        className="block w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${filters.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 hover:bg-gray-50'}`}
                        disabled={filters.currentPage === 1}
                        onClick={() => setPaginationCurrentPage(filters.currentPage - 1)}
                    >
                        Previous
                    </button>
                    {getVisiblePages(filters.currentPage, totalPages, 7).map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded-md text-sm ${page === filters.currentPage
                                    ? 'bg-purple-500 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'}
                                    `}
                                onClick={() => setPaginationCurrentPage(page)}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button
                        className={`px-3 py-1 rounded-md text-sm ${filters.currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border border-gray-300 hover:bg-gray-50'}`}
                        disabled={filters.currentPage === totalPages}
                        onClick={() => setPaginationCurrentPage(filters.currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
}