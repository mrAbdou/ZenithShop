// hooks/products.js
"use client";

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchProduct,
    fetchProductsCount,
    fetchAvailableProductsCount,
    fetchProductsInCart,
    addProduct,
    filteredProductsCount,
    fetchPaginatedProducts,
    fetchInfiniteProducts,
} from "@/services/products.client";
import { AddProductSchema, safeValidate } from "@/lib/zodSchemas";
import { LIMIT } from "@/lib/constants";

/**
 * Hook to fetch a paginated list of products.
 * Accepts optional initialData (array) from SSR.
 */
export function usePaginationProducts(initialData = [], filters = { searchQuery: '', startDate: null, endDate: null, sortBy: null, sortDirection: null, limit: 5, currentPage: 1 }) {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => fetchPaginatedProducts(filters),
        initialData
    });
}

export function useInfiniteProducts(limit = LIMIT, offset = 0, initialData = []) {
    return useInfiniteQuery({
        queryKey: ["products", limit, offset],
        queryFn: ({ pageParam = 0 }) => fetchInfiniteProducts(limit, pageParam),
        initialData: {
            pages: [initialData],
            pageParams: [offset],
        },
        getNextPageParam: (lastPage, allPages) => {
            const loadedItems = allPages.reduce(
                (acc, page) => acc + (page?.length || 0),
                0
            );

            // If the last page has fewer items than the limit, we've reached the end
            return lastPage && lastPage.length === limit
                ? loadedItems   // this becomes the NEXT offset
                : undefined;    // stop
        }

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
export function useProductsCount(initialData) {
    return useQuery({
        queryKey: ["productsCount"],
        queryFn: fetchProductsCount,
        initialData
    });
}

/** Count of available (in‑stock) products */
export function useAvailableProductsCount(initialData) {
    return useQuery({
        queryKey: ["availableProductsCount"],
        queryFn: fetchAvailableProductsCount,
        initialData
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            const validation = safeValidate(AddProductSchema, data);
            if (!validation.success) {
                throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
            }
            return addProduct(validation.data);
        },
    }, {
        onSuccess: async (data) => {
            await queryClient.setQueryData({
                queryKey: ["products"],
                data: (prevData) => {
                    if (!prevData) return [data];
                    return [...prevData, data];
                }
            });
            await queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        },
    });
}

export function useCountFilteredProducts(filters) {
    return useQuery({
        queryKey: ["countFilteredProducts"],
        queryFn: () => filteredProductsCount(filters),
    });
}
