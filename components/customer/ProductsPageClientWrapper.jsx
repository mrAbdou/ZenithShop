'use client';

import ProductProvider from "@/context/ProductContext";
import CustomerProductsFilters from "./CustomerProductsFilters";
import ProductsListing from "./ProductsListing";

export default function ProductsPageClientWrapper({ initialProducts, initialCategories, translations, commonTranslations }) {
    return (
        <ProductProvider>
            <CustomerProductsFilters initialCategories={initialCategories} translations={translations} />
            <ProductsListing initialData={initialProducts} translations={translations} commonTranslations={commonTranslations} />
        </ProductProvider>
    );
}