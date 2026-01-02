import { graphqlRequest } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { AddProductSchema, InfiniteProductSchema, ProductPaginationSchema, UpdateProductSchema } from '@/lib/schemas/product.schema';
import { LIMIT } from '@/lib/constants';
import ZodValidationError from '@/lib/ZodValidationError';
export const GET_INFINITE_PRODUCTS = gql`
query GetInfiniteProducts($limit: Int!, $offset: Int!, $searchQuery: String, $stock: String, $minPrice: Float, $maxPrice: Float, $sortBy: String, $sortDirection: String) {
    infiniteProducts(limit: $limit, offset: $offset, searchQuery: $searchQuery, stock: $stock, minPrice: $minPrice, maxPrice: $maxPrice, sortBy: $sortBy, sortDirection: $sortDirection) {
        id
        name
        description
        qteInStock
        price
        createdAt
    }
}`;

export const GET_PAGINATED_PRODUCTS = gql`
query GetPaginatedProducts($searchQuery: String, $stock: String, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $limit: Int!, $currentPage: Int!) {
    paginatedProducts(searchQuery: $searchQuery, stock: $stock, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, limit: $limit, currentPage: $currentPage) {
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
export async function fetchPaginatedProducts(variables) {
    try {
        const data = await graphqlRequest(GET_PAGINATED_PRODUCTS, variables);
        return data?.paginatedProducts ?? [];
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function fetchInfiniteProducts(variables = { limit: LIMIT, offset: 0 }) {
    try {
        const data = await graphqlRequest(GET_INFINITE_PRODUCTS, variables);
        return data?.infiniteProducts ?? [];
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function fetchProduct(variables) {
    try {
        const data = await graphqlRequest(GET_PRODUCT, variables);
        return data?.product ?? null;
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function fetchProductsCount(variables) {
    try {
        const data = await graphqlRequest(GET_PRODUCTS_COUNT, variables);
        return data?.productsCount ?? 0;
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function fetchAvailableProductsCount(variables) {
    try {
        const data = await graphqlRequest(GET_AVAILABLE_PRODUCTS_COUNT, variables);
        return data?.availableProductsCount ?? 0;
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function fetchProductsInCart(variables) {
    try {
        const data = await graphqlRequest(GET_PRODUCTS_IN_CART, variables);
        return data?.productsInCart ?? [];
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function addProduct(variables) {
    try {
        const data = await graphqlRequest(ADD_PRODUCT, variables);
        return data?.addNewProduct ?? null;
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function filteredProductsCount(variables) {
    try {
        const data = await graphqlRequest(FILTERED_PRODUCTS_COUNT, variables);
        return data?.filteredProductsCount ?? 0;
    } catch (gqlError) {
        throw gqlError;
    }
}
export async function updateProduct(variables) {
    try {
        const data = await graphqlRequest(UPDATE_PRODUCT, variables);
        return data?.updateProduct ?? null;
    } catch (gqlError) {
        throw gqlError;
    }
}
