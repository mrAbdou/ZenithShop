'use client';

import { useState } from 'react';
import { CategoryProvider } from '@/context/CategoryContext';
import CategoriesFilters from '@/components/admin/CategoriesFilters';
import CategoriesTable from '@/components/admin/CategoriesTable';
import AddCategoryForm from '@/components/admin/AddCategoryForm';
import { useTranslation } from '@/lib/i18n/context';

export default function CategoriesManagement({ initialCategories, initialCategoriesCount }) {
    const { t } = useTranslation();
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <CategoryProvider>
            <div className="space-y-6">
                {/* Add Category Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">{t('admin.categories.addCategory')}</h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            {showAddForm ? t('common.cancel') : t('admin.categories.addCategory')}
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