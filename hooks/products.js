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
    updateProduct,
} from "@/services/products.client";
import { LIMIT } from "@/lib/constants";

/**
 * Hook to fetch a paginated list of products.
 * Accepts optional initialData (array) from SSR.
 */
export function usePaginationProducts(initialData = [], filters) {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => fetchPaginatedProducts(filters),
        initialData
    });
}

export function useInfiniteProducts(initialData = [], limit) {
    return useInfiniteQuery({
        queryKey: ["products", limit],
        queryFn: ({ pageParam = 0 }) => fetchInfiniteProducts(limit, pageParam),
        initialPageParam: 0,
        initialData: {
            pages: [initialData],
            pageParams: [0],
        },
        getNextPageParam: (lastPage, allPages) => {
            const loadedItems = allPages.reduce(
                (acc, page) => acc + (page?.length || 0),
                0
            );

            return lastPage && lastPage.length === limit
                ? loadedItems   // this becomes the NEXT offset
                : undefined;    // stop
        }

    });
}
/** Fetch a single product by ID */
export function useProduct(id) {
    console.log('useProduct hook params: ', id);
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
        mutationFn: async (data) => {
            try {
                return await addProduct(data)
            } catch (error) {
                console.error('Add Product mutation error : ', error);
                throw error;
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.setQueryData(['product', data.id], data);
                queryClient.setQueryData(['products'], (oldData) => {
                    if (!oldData) return [data];
                    return [...oldData, data];
                });

                queryClient.invalidateQueries({ queryKey: ['productsCount'] });
                queryClient.invalidateQueries({ queryKey: ['availableProductsCount'] });
                queryClient.invalidateQueries({ queryKey: ['countFilteredProducts'] });
            } catch (cacheError) {
                console.error('Cache Update Error : ', cacheError);
            }
        }
    })
}

export function useCountFilteredProducts(filters) {
    return useQuery({
        queryKey: ["countFilteredProducts", filters],
        queryFn: () => filteredProductsCount(filters),
    });
}

export function useUpdateProduct(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateProduct(id, data),
        onSuccess: (data) => {
            // Update the specific product cache
            queryClient.setQueryData(['product', id], data);

            // Update the product in the products list if it exists
            queryClient.setQueryData(['products'], (oldData) => {
                if (!oldData) return [data];
                return oldData.map((product) => (product.id === id ? data : product));
            });

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['productsCount'] });
            queryClient.invalidateQueries({ queryKey: ['availableProductsCount'] });
            queryClient.invalidateQueries({ queryKey: ['countFilteredProducts'] });
            queryClient.invalidateQueries({
                queryKey: ["products"],
                predicate: (query) => query.queryKey.length > 1 // Invalidate filtered queries
            });
        }
    })
}
