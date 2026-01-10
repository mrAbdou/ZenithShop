'use client';

import { CategoryProvider } from '@/context/CategoryContext';
import CategoriesFilters from '@/components/admin/CategoriesFilters';
import CategoriesTable from '@/components/admin/CategoriesTable';

export default function CategoriesManagement({ initialCategories, initialCategoriesCount }) {
    return (
        <CategoryProvider>
            <div className="space-y-6">
                {/* Categories Filters */}
                <CategoriesFilters />

                {/* Categories Table */}
                <CategoriesTable initialCategories={initialCategories} initialCategoriesCount={initialCategoriesCount} />
            </div>
        </CategoryProvider>
    );
}