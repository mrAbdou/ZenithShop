// hooks/products.js
"use client";

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import {
    fetchProducts,
    fetchProduct,
    fetchProductsCount,
    fetchAvailableProductsCount,
    fetchProductsInCart,
    addProduct,
} from "@/services/products";
import { LIMIT } from "@/lib/constants";

/**
 * Hook to fetch a paginated list of products.
 * Accepts optional initialData (array) from SSR.
 */
export function useProducts(initialData = []) {
    const hasInitial = Array.isArray(initialData) && initialData.length > 0;
    const formattedInitial = hasInitial ? { pages: [initialData], pageParams: [0] } : undefined;

    return useInfiniteQuery({
        queryKey: ["products", LIMIT],
        queryFn: ({ pageParam = 0 }) => fetchProducts(LIMIT, pageParam),
        getNextPageParam: (lastPage, allPages) =>
            lastPage?.length === LIMIT ? allPages.length * LIMIT : undefined,
        ...(hasInitial && { initialData: formattedInitial }),
        staleTime: 0,
        refetchOnMount: true,
        keepPreviousData: true,
    });
}

/** Fetch a single product by ID */
export function useProduct(id) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id),
        enabled: !!id,
    });
}

/** Count of all products */
export function useProductsCount() {
    return useQuery({
        queryKey: ["productsCount"],
        queryFn: fetchProductsCount,
    });
}

/** Count of available (in‑stock) products */
export function useAvailableProductsCount() {
    return useQuery({
        queryKey: ["availableProductsCount"],
        queryFn: fetchAvailableProductsCount,
    });
}

/** Fetch products that are currently in the cart */
export function useProductsInCart(cart) {
    return useQuery({
        queryKey: ["productsInCart", cart],
        queryFn: () => fetchProductsInCart(cart),
        enabled: Array.isArray(cart) && cart.length > 0,
    });
}

/** Mutation to add a new product */
export function useAddProduct() {
    return useMutation({
        mutationFn: addProduct,
    });
}
