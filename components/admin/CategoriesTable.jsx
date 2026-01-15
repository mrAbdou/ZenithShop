'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCategoryContext } from '@/context/CategoryContext';
import { useCategories, useCountFilteredCategories, useDeleteCategory } from '@/hooks/categories';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';

export default function CategoriesTable({ initialCategories, initialCategoriesCount }) {
    const { t } = useTranslation();

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
    const { filters, setSortingFilters, setPaginationLimit, setPaginationCurrentPage } = useCategoryContext();
    const { data: categories } = useCategories(filters, initialCategories);
    const { data: totalCategories } = useCountFilteredCategories(filters, initialCategoriesCount);
    const { mutateAsync: deleteCategoryAsync, isPending: isDeleting } = useDeleteCategory();

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategoryAsync(categoryToDelete.id, {
                onSuccess: () => {
                    toast.success(t('admin.categories.categoryDeleted'));
                    closeDeleteModal();
                },
                onError: (error) => {
                    toast.error(error?.message || t('admin.categories.deleteFailed'));
                }
            });
        } catch (error) {
            toast.error(t('admin.categories.deleteFailed'));
        }
    };
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.categories.management')}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => onHeaderClick('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText(t('admin.categories.categoryId'), 'id')}
                            </th>
                            <th onClick={() => onHeaderClick('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText(t('admin.categories.name'), 'name')}
                            </th>
                            <th onClick={() => onHeaderClick('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText(t('admin.categories.created'), 'createdAt')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('admin.categories.actions')}
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
                                            href={`/control-panel/categories/${category.id}/edit`}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                        >
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {t('common.edit')}
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(category)}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                        >
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            {t('admin.categories.deleteCategoryBtn')}
                                        </button>
                                        <Link
                                            href={`/control-panel/products?categoryId=${category.id}`}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <svg className="w-3 h-3 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {t('admin.categories.viewProducts')}
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!categories || categories.length === 0) && (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    {t('admin.categories.noCategoriesFound')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    {t('common.showing')} {((filters.currentPage - 1) * filters.limit) + 1} {t('common.to')} {Math.min(filters.currentPage * filters.limit, totalCategories || 0)} {t('common.of')} {totalCategories || 0} {t('admin.categories.showingCategories')}
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
                        {t('common.previous')}
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
                        {t('common.next')}
                    </button>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && categoryToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">{t('admin.categories.deleteCategoryModalTitle')}</h3>
                                <p className="text-sm text-gray-500">{t('admin.categories.deleteCategoryConfirm')}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700">
                                {t('admin.categories.categoryName')}: <span className="font-semibold">{categoryToDelete.name}</span>
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                {t('admin.categories.productsWillBeUncategorized')}
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={isDeleting}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-300 font-semibold disabled:opacity-60 cursor-not-allowed flex items-center"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('admin.categories.deleting')}
                                    </>
                                ) : (
                                    t('admin.categories.deleteCategory')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}