'use client';

import ProductProvider from "@/context/ProductContext";
import CustomerProductsFilters from "./CustomerProductsFilters";
import ProductsListing from "./ProductsListing";

export default function ProductsPageClientWrapper({ initialProducts, initialCategories }) {
    return (
        <ProductProvider>
            <CustomerProductsFilters initialCategories={initialCategories} />
            <ProductsListing initialData={initialProducts} />
        </ProductProvider>
    );
}