'use client';

import { useState } from 'react';
import { CategoryProvider } from '@/context/CategoryContext';
import CategoriesFilters from '@/components/admin/CategoriesFilters';
import CategoriesTable from '@/components/admin/CategoriesTable';
import AddCategoryForm from '@/components/admin/AddCategoryForm';

export default function CategoriesManagement({ initialCategories, initialCategoriesCount }) {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <CategoryProvider>
            <div className="space-y-6">
                {/* Add Category Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Add New Category</h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            {showAddForm ? 'Cancel' : 'Add Category'}
                        </button>
                    </div>
                    {showAddForm && (
                        <AddCategoryForm />
                    )}
                </div>

                {/* Categories Filters */}
                <CategoriesFilters />

                {/* Categories Table */}
                <CategoriesTable initialCategories={initialCategories} initialCategoriesCount={initialCategoriesCount} />
            </div>
        </CategoryProvider>
    );
}