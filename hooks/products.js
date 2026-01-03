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
    deleteProduct,
} from "@/services/products.client";
import { AddProductSchema, FilteringProductPaginationSchema, InfiniteProductSchema, ProductPaginationSchema, UpdateProductSchema } from "@/lib/schemas/product.schema";
import ZodValidationError from "@/lib/ZodValidationError";

/** Count of all products */
export function useProductsCount(initialData) {
    return useQuery({
        queryKey: ["productsCount"],
        queryFn: () => fetchProductsCount(),
        initialData: initialData ? initialData : 0,
    });
}

/** Count of available (in‑stock) products */
export function useAvailableProductsCount(initialData) {
    return useQuery({
        queryKey: ["availableProductsCount"],
        queryFn: () => fetchAvailableProductsCount(),
        initialData: initialData ? initialData : 0,
    });
}

export function useCountFilteredProducts(filters) {
    return useQuery({
        queryKey: ["countFilteredProducts", filters],
        queryFn: () => {
            //TODO: we need a schema only for filtering props not passing the full variables
            const validation = FilteringProductPaginationSchema.safeParse(filters);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return filteredProductsCount(validation.data)
        },
    });
}

/**
 * Hook to fetch a paginated list of products.
 * Accepts optional initialData (array) from SSR.
 */
export function usePaginationProducts(variables, initialData) {
    return useQuery({
        queryKey: ["products", variables],
        queryFn: () => {
            const validation = ProductPaginationSchema.safeParse(variables);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return fetchPaginatedProducts(validation.data)
        },
        initialData
    });
}

export function useInfiniteProducts(variables, initialData) {
    return useInfiniteQuery({
        queryKey: ["products", variables],
        queryFn: ({ pageParam = 0 }) => {
            const validation = InfiniteProductSchema.safeParse({ ...variables, offset: pageParam });
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return fetchInfiniteProducts(validation.data)
        },
        initialPageParam: 0,
        initialData: initialData ? {
            pages: [initialData],
            pageParams: [0],
        } : undefined,
        getNextPageParam: (lastPage, allPages) => {
            const loadedItems = allPages.reduce(
                (acc, page) => acc + (page?.length || 0),
                0
            );

            return lastPage && lastPage.length === variables.limit
                ? loadedItems   // this becomes the NEXT offset
                : undefined;    // stop
        }

    });
}
/** Fetch a single product by ID */
export function useProduct(id) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => {
            if (!id || typeof id !== 'string') {
                return null;
            }
            return fetchProduct({ id })
        },
        enabled: !!id,
    });
}


/** Fetch products that are currently in the cart */
export function useProductsInCart(cart) {
    return useQuery({
        queryKey: ["productsInCart", cart],
        queryFn: () => {
            if (!cart || !Array.isArray(cart) || cart.length === 0) {
                return [];
            }
            return fetchProductsInCart({ cart })
        },
        enabled: Array.isArray(cart) && cart.length > 0,
    });
}

/** Mutation to add a new product */
export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const validation = AddProductSchema.safeParse(data);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            try {
                return await addProduct({ product: validation.data });
            } catch (gqlError) {
                throw gqlError;
            }
        },
        onSuccess: (data) => {
            try {
                queryClient.setQueryData(['product', data.id], data);
                queryClient.invalidateQueries({ queryKey: ['products'] });
                queryClient.invalidateQueries({ queryKey: ['productsCount'] });
                queryClient.invalidateQueries({ queryKey: ['availableProductsCount'] });
                queryClient.invalidateQueries({ queryKey: ['countFilteredProducts'] });
            } catch (cacheError) {
                console.error('Cache Update Error : ', cacheError);
            }
        }
    })
}

export function useUpdateProduct(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            const validation = UpdateProductSchema.safeParse(data);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return updateProduct({ id, product: validation.data })
        },
        onSuccess: (data) => {
            // Update the specific product cache
            queryClient.setQueryData(['product', id], data);

            // Update the product in the products list if it exists
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['productsCount'] });
            queryClient.invalidateQueries({ queryKey: ['availableProductsCount'] });
            queryClient.invalidateQueries({ queryKey: ['countFilteredProducts'] });
        }
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteProduct({ id }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['productsCount'] });
            queryClient.invalidateQueries({ queryKey: ['availableProductsCount'] });
            queryClient.invalidateQueries({ queryKey: ['countFilteredProducts'] });
        }
    })
}