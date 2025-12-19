import { graphqlRequest } from '@/lib/graphql-client';
import { LIMIT } from '@/lib/constants';
import { gql } from 'graphql-request';
import { AddProductSchema, safeValidate, UpdateProductSchema } from '@/lib/zodSchemas';
export const GET_PAGINATED_PRODUCTS = gql`
query GetPaginatedProducts($searchQuery: String,$stock: String, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $limit: Int, $currentPage: Int) {
    paginatedProducts(searchQuery: $searchQuery, stock: $stock, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, limit: $limit, currentPage: $currentPage) {
        id
        name
        description
        qteInStock
        price
        createdAt
    }
}`;
export const GET_INFINITE_PRODUCTS = gql`
query GetInfiniteProducts($limit: Int, $offset: Int) {
    infiniteProducts(limit: $limit, offset: $offset) {
        id
        name
        description
        qteInStock
        price
        createdAt
    }
}`;
export const GET_PRODUCT = gql`
query GetProduct($id: String!) {
    product(id: $id) {
        id
        name
        description
        price
        qteInStock
        createdAt
    }
}`;
export const GET_PRODUCTS_COUNT = gql`
query GetProductsCount {
    productsCount
}`;
export const GET_AVAILABLE_PRODUCTS_COUNT = gql`
query GetAvailableProductsCount {
    availableProductsCount
}`;
export const GET_PRODUCTS_IN_CART = gql`
query GetProductsInCart($cart: [ID!]!) {
    productsInCart(cart: $cart) {
        id
        name
        price
    }
}`;
export const ADD_PRODUCT = gql`
mutation addProduct($newProduct: ProductInput!){
    addNewProduct(product: $newProduct){
        id
        name
        description
        price
        qteInStock
    }
}`;
export const FILTERED_PRODUCTS_COUNT = gql`
query GetFilteredProductsCount($searchQuery: String, $stock: String, $startDate: DateTime, $endDate: DateTime) {
    filteredProductsCount(searchQuery: $searchQuery, stock: $stock, startDate: $startDate, endDate: $endDate)
}`;
export const UPDATE_PRODUCT = gql`
mutation updateProduct($id: String!, $product: UpdateProductInput!) {
    updateProduct(id: $id, product: $product) {
        id
        name
        description
        price
        qteInStock
    }
}`;
export async function fetchPaginatedProducts(filters) {
    try {
        const sanitizedFilters = {
            ...filters,
            startDate: filters.startDate === '' ? null : filters.startDate,
            endDate: filters.endDate === '' ? null : filters.endDate,
        };
        const data = await graphqlRequest(GET_PAGINATED_PRODUCTS, sanitizedFilters);
        return data?.paginatedProducts ?? [];
    } catch (error) {
        throw error;
    }

}
export async function fetchInfiniteProducts(limit, offset) {
    try {
        if (!Number.isFinite(limit)) throw new Error('Invalid limit value');
        if (!Number.isFinite(offset)) throw new Error('Invalid offset value');
        const data = await graphqlRequest(GET_INFINITE_PRODUCTS, { limit, offset });
        return data?.infiniteProducts ?? [];
    } catch (error) {
        if (error.response?.errors) {
            const errorString = error.response.errors.map(err => err.message).join('\n');
            throw new Error(errorString);
        }
        throw error;
    }
}
export async function fetchProduct(id) {
    try {
        console.log('fetchProduct service params: ', id);
        const data = await graphqlRequest(GET_PRODUCT, { id });
        return data?.product ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchProductsCount() {
    try {
        const data = await graphqlRequest(GET_PRODUCTS_COUNT, {});
        return data?.productsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchAvailableProductsCount() {
    try {
        const data = await graphqlRequest(GET_AVAILABLE_PRODUCTS_COUNT, {});
        return data?.availableProductsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchProductsInCart(cart) {
    try {
        const data = await graphqlRequest(GET_PRODUCTS_IN_CART, { cart });
        return data?.productsInCart ?? [];
    } catch (error) {
        console.log('ERRORS:', JSON.stringify(error, null, 2));
        throw error;
    }
}
export async function addProduct(newProduct) {
    try {
        const validation = safeValidate(AddProductSchema, newProduct);
        if (!validation.success) {
            throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
        }
        const data = await graphqlRequest(ADD_PRODUCT, { newProduct: validation.data });
        return data?.addNewProduct ?? null;
    } catch (error) {
        throw error;
    }
}
export async function filteredProductsCount(filters) {
    try {
        const data = await graphqlRequest(FILTERED_PRODUCTS_COUNT, {
            searchQuery: filters.searchQuery,
            stock: filters.stock,
            startDate: filters.startDate === '' ? null : filters.startDate,
            endDate: filters.endDate === '' ? null : filters.endDate
        });
        return data?.filteredProductsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function updateProduct(id, product) {
    try {
        if (!id || typeof id !== 'string') throw new Error('Invalid product ID');
        const validation = safeValidate(UpdateProductSchema, product);
        if (!validation.success) {
            const errorMessage = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new Error(`Validation failed: ${errorMessage}`);
        }
        const data = await graphqlRequest(UPDATE_PRODUCT, { id, product: validation.data });
        return data?.updateProduct ?? null;
    } catch (error) {
        throw error;
    }
}
