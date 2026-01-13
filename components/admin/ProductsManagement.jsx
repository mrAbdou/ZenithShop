'use client';

import ProductsFilters from "./ProductsFilters";
import ProductsTable from "./ProductsTable";
import ProductProvider from "@/context/ProductContext";

export default function ProductsManagement({ products = [], categories = [], initialCategoryId }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            <ProductProvider>
                <ProductsFilters initialCategories={categories} initialCategoryId={initialCategoryId} />
                <ProductsTable initialData={products} />
            </ProductProvider>
        </div>
    );
}