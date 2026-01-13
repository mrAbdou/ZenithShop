import { LIMIT } from '@/lib/constants';
import { graphqlServerRequest } from '@/lib/graphql-server';
import { gql } from 'graphql-request';
export const GET_INFINITE_PRODUCTS = gql`
query GetInfiniteProducts($limit: Int!, $offset: Int!, $searchQuery: String, $stock: String, $minPrice: Float, $maxPrice: Float, $categoryId: String, $sortBy: String, $sortDirection: String) {
    infiniteProducts(limit: $limit, offset: $offset, searchQuery: $searchQuery, stock: $stock, minPrice: $minPrice, maxPrice: $maxPrice, categoryId: $categoryId, sortBy: $sortBy, sortDirection: $sortDirection) {
        id
        name
        description
        qteInStock
        price
        createdAt
        category {
            id
            name
        }
    }
}`;
export const GET_PAGINATED_PRODUCTS = gql`
query GetPaginatedProducts($searchQuery: String, $stock: String, $startDate: DateTime, $endDate: DateTime, $categoryId: String, $sortBy: String, $sortDirection: String, $limit: Int!, $currentPage: Int!) {
    paginatedProducts(searchQuery: $searchQuery, stock: $stock, startDate: $startDate, endDate: $endDate, categoryId: $categoryId, sortBy: $sortBy, sortDirection: $sortDirection, limit: $limit, currentPage: $currentPage) {
        id
        name
        description
        qteInStock
        price
        createdAt
        category {
            id
            name
        }
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
        images
        category {
            id
            name
        }
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
export const FILTERED_PRODUCTS_COUNT = gql`
query GetFilteredProductsCount($searchQuery: String, $stock: String, $startDate: DateTime, $endDate: DateTime, $categoryId: String) {
    filteredProductsCount(searchQuery: $searchQuery, stock: $stock, startDate: $startDate, endDate: $endDate, categoryId: $categoryId)
}`;

export const GET_FEATURED_PRODUCTS = gql`
query GetFeaturedProducts($head: Int!) {
    featuredProducts(head: $head) {
        id
        name
        price
    }
}`;

export async function fetchPaginatedProducts(variables, cookieHeader) {
    try {
        // const data = await graphqlServerRequest(GET_PAGINATED_PRODUCTS, {
        //     searchQuery: variables.searchQuery,
        //     stock: variables.stock,
        //     startDate: variables.startDate,
        //     endDate: variables.endDate,
        //     sortBy: variables.sortBy,
        //     sortDirection: variables.sortDirection,
        //     limit: variables.limit,
        //     currentPage: variables.currentPage
        // }, cookieHeader);
        const data = await graphqlServerRequest(GET_PAGINATED_PRODUCTS, variables, cookieHeader);
        return data?.paginatedProducts ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchInfiniteProducts(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_INFINITE_PRODUCTS, variables, cookieHeader);
        return data?.infiniteProducts ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchProduct(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_PRODUCT, variables, cookieHeader);
        return data?.product ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchProductsCount(variables = {}, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_PRODUCTS_COUNT, variables, cookieHeader);
        return data?.productsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchAvailableProductsCount(variables = {}, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_AVAILABLE_PRODUCTS_COUNT, variables, cookieHeader);
        return data?.availableProductsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchProductsInCart(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_PRODUCTS_IN_CART, variables, cookieHeader);
        return data?.productsInCart ?? [];
    } catch (error) {
        throw error;
    }
}
export async function filteredProductsCount(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(FILTERED_PRODUCTS_COUNT, variables, cookieHeader);
        return data?.filteredProductsCount ?? 0;
    } catch (gqlError) {
        throw gqlError;
    }
}

export async function fetchFeaturedProducts(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_FEATURED_PRODUCTS, variables, cookieHeader);
        return data?.featuredProducts ?? [];
    } catch (gqlError) {
        throw gqlError;
    }
}