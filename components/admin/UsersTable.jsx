"use client";
import { useCountFilteredUsers, useUsers } from "@/hooks/users";
import { useUserContext } from "@/context/usersContext";
import { useCallback, useMemo, useState } from "react";
import { useDeleteUser } from "@/hooks/users";
import Link from "next/link";
import toast from "react-hot-toast";

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

export default function UsersTable({ initialData = [] }) {
    const { filters, setPaginationCurrentPage, setPaginationLimit, setSortingFilters } = useUserContext();
    const { data: users, error: usersError } = useUsers(filters, initialData);
    const { data: filteredUsersCount, error: usersCountError } = useCountFilteredUsers(filters);
    const { mutate: deleteUser } = useDeleteUser();

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;

        deleteUser(userToDelete.id);
        toast.success('User deleted successfully');
        closeDeleteModal();
    };
    const totalPages = useMemo(() => filteredUsersCount && filteredUsersCount > 0 ? Math.ceil(filteredUsersCount / filters.limit) : 1, [filteredUsersCount, filters.limit]);

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
    }, [filters.currentPage, totalPages]);

    const getHeaderText = (label, field) => {
        if (filters.sortBy === field) {
            return filters.sortDirection === 'asc' ? `${label} ↑` : filters.sortDirection === 'desc' ? `${label} ↓` : `${label} ⇅`;
        }
        return `${label} ⇅`;
    };

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


    const onChangeLimit = (e) => {
        const limit = parseInt(e.target.value.trim());
        setPaginationLimit(limit);
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users Management</h2>
            {usersError && <div className='w-full bg-red-300 text-red-700 p-2'>
                <h1>{`users: ${usersError?.message}`}</h1>
                <ul>
                    {usersError?.issues?.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </div>}
            {usersCountError && <div className='w-full bg-red-300 text-red-700 p-2'>
                <h1>{`usersCount: ${usersCountError?.message}`}</h1>
                <ul>
                    {usersCountError?.issues?.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </div>}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => onHeaderClick('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('User ID', 'id')}
                            </th>
                            <th onClick={() => onHeaderClick('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Name', 'name')}
                            </th>
                            <th onClick={() => onHeaderClick('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Email', 'email')}
                            </th>
                            <th onClick={() => onHeaderClick('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                {getHeaderText('Role', 'role')}
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
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.id.slice(-8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/control-panel/users/${user.id}`}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!users || users.length === 0) && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <section className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Showing {((filters.currentPage - 1) * filters.limit) + 1} to {Math.min(filters.currentPage * filters.limit, filteredUsersCount || 0)} of {filteredUsersCount || 0} users
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

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                                <p className="text-sm text-gray-500">Are you sure you want to delete this user?</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700">
                                User: <span className="font-semibold">{userToDelete.name}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Email: <span className="font-semibold">{userToDelete.email}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Role: <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userToDelete.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {userToDelete.role}
                                </span>
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                                ⚠️ This action cannot be undone. All user data and associated orders will be permanently removed.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-300 font-semibold flex items-center"
                            >
                                <svg className="w-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}