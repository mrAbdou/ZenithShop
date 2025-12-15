// hooks/products.js
"use client";

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchProducts,
    fetchProduct,
    fetchProductsCount,
    fetchAvailableProductsCount,
    fetchProductsInCart,
    addProduct,
} from "@/services/products.client";
import { AddProductSchema, safeValidate } from "@/lib/zodSchemas";

/**
 * Hook to fetch a paginated list of products.
 * Accepts optional initialData (array) from SSR.
 */
export function useProducts(limit, offset, initialData = []) {
    const hasInitial = Array.isArray(initialData) && initialData.length > 0;
    const formattedInitial = hasInitial ? { pages: [initialData], pageParams: [0] } : undefined;
    return useInfiniteQuery({
        queryKey: ["products", limit, offset],
        queryFn: ({ pageParam = offset }) => fetchProducts(limit, pageParam),
        getNextPageParam: (lastPage, allPages) =>
            lastPage?.length === limit ? allPages.length * limit : undefined,
        ...(hasInitial && { initialData: formattedInitial }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnMount: false,
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
