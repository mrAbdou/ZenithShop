"use client";
import { useCountFilteredProducts, usePaginationProducts } from "@/hooks/products";
import { useRouter } from "next/navigation";
import { useProductContext } from "@/context/ProductContext";
import { useMemo } from "react";

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

export default function ProductsTable({ initialData = [] }) {
    const router = useRouter();

    const { getFilters, setPaginationCurrentPage, setPaginationLimit, setSortingFilters } = useProductContext();
    const filters = getFilters();

    const { data: products } = usePaginationProducts(initialData, filters);
    const { data: filteredProductsCount } = useCountFilteredProducts(filters);
    const totalPages = useMemo(() => filteredProductsCount && filteredProductsCount > 0 ? Math.ceil(filteredProductsCount / filters.limit) : 1, [filteredProductsCount, filters.limit]);

    const getVisiblePages = (currentPage, totalPages, maxVisible = 7) => {
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
    };

    const onViewProduct = (productId) => {
        router.push(`/control-panel/products/${productId}`);
    };

    const onEditProduct = (productId) => {
        router.push(`/control-panel/products/${productId}/edit`);
    };

    const onDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            // Delete logic will be implemented later
        }
    };
    const onChangeLimit = (e) => {
        const limit = parseInt(e.target.value.trim());
        setPaginationLimit(limit);
    }
    const getHeaderText = (label, field) => {
        if (filters.sortBy === field) {
            return filters.sortDirection === 'asc' ? `${label} ↑` : filters.sortDirection === 'desc' ? `${label} ↓` : `${label} ⇅`;
        }
        return `${label} ⇅`;
    }
    const onHeaderClick = (field) => {
        let sortBy;
        let sortDirection;
        if (filters.sortBy === field) {
            if (filters.sortDirection === 'desc') {
                sortDirection = 'asc';
            } else if (filters.sortDirection === 'asc') {
                sortDirection = null;
                sortBy = null;
            } else {
                sortDirection = 'desc';
            }
        } else {
            sortDirection = 'desc';
        }
        sortBy = sortBy !== undefined ? sortBy : field;
        setSortingFilters({ sortBy, sortDirection });
    }
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Products Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => onHeaderClick('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {getHeaderText('Product ID', 'id')}
                            </th>
                            <th onClick={() => onHeaderClick('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {getHeaderText('Name', 'name')}
                            </th>
                            <th onClick={() => onHeaderClick('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {getHeaderText('Price', 'price')}
                            </th>
                            <th onClick={() => onHeaderClick('qteInStock')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {getHeaderText('Stock', 'qteInStock')}
                            </th>
                            <th onClick={() => onHeaderClick('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {getHeaderText('Created', 'createdAt')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products?.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.qteInStock > 10 ? 'bg-green-100 text-green-800' :
                                        product.qteInStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {product.qteInStock > 10 ? `In Stock (${product.qteInStock})` :
                                            product.qteInStock > 0 ? `Low Stock (${product.qteInStock})` : `Out of Stock (${product.qteInStock})`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(product.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onViewProduct(product.id)}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => onEditProduct(product.id)}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDeleteProduct(product.id)}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing {((filters.currentPage - 1) * filters.limit) + 1} to {Math.min(filters.currentPage * filters.limit, filteredProductsCount || 0)} of {filteredProductsCount || 0} products
                </div>
                <div className="flex items-center gap-2">
                    <select onChange={onChangeLimit} className="block w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                                    }`}
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
