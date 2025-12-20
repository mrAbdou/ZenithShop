import { graphqlRequest } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { AddProductSchema, InfiniteProductSchema, ProductPaginationSchema, UpdateProductSchema } from '@/lib/schemas/product.schema';
export const GET_PAGINATED_PRODUCTS = gql`
query GetPaginatedProducts($searchQuery: String, $stock: String, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $limit: Int, $currentPage: Int) {
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
    const validation = ProductPaginationSchema.safeParse(filters);
    if (!validation.success) {
        throw new Error(Object.entries(validation.error.issues).map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'));
    }

    const data = await graphqlRequest(GET_PAGINATED_PRODUCTS, validation.data);
    return data?.paginatedProducts ?? [];

}
export async function fetchInfiniteProducts(limit, offset) {
    const validation = InfiniteProductSchema.safeParse({ limit, offset });
    if (!validation.success) {
        throw new Error(Object.entries(validation.error.issues).map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'));
    }
    const data = await graphqlRequest(GET_INFINITE_PRODUCTS, validation.data);
    return data?.infiniteProducts ?? [];
}
export async function fetchProduct(id) {
    console.log('fetchProduct service params: ', id);
    const data = await graphqlRequest(GET_PRODUCT, { id });
    return data?.product ?? null;
}
export async function fetchProductsCount() {
    const data = await graphqlRequest(GET_PRODUCTS_COUNT, {});
    return data?.productsCount ?? 0;
}
export async function fetchAvailableProductsCount() {
    const data = await graphqlRequest(GET_AVAILABLE_PRODUCTS_COUNT, {});
    return data?.availableProductsCount ?? 0;
}
export async function fetchProductsInCart(cart) {
    const data = await graphqlRequest(GET_PRODUCTS_IN_CART, { cart });
    return data?.productsInCart ?? [];
}
export async function addProduct(newProduct) {
    try {
        const validation = AddProductSchema.safeParse(newProduct);
        if (!validation.success) {
            throw new Error(Object.entries(validation.error.flatten().fieldErrors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('; '));
        }
        const data = await graphqlRequest(ADD_PRODUCT, { newProduct: validation.data });
        return data?.addNewProduct ?? null;
    } catch (gqlError) {
        console.error('Add Product service error : ', gqlError);
        throw gqlError;
    }
}
export async function filteredProductsCount(filters) {
    const data = await graphqlRequest(FILTERED_PRODUCTS_COUNT, {
        searchQuery: filters.searchQuery,
        stock: filters.stock,
        startDate: filters.startDate === '' ? null : filters.startDate,
        endDate: filters.endDate === '' ? null : filters.endDate
    });
    return data?.filteredProductsCount ?? 0;
}
export async function updateProduct(id, product) {
    if (!id || typeof id !== 'string') throw new Error('Invalid product ID');
    const validation = UpdateProductSchema.safeParse(product);
    if (!validation.success) {
        const errorMessage = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
        throw new Error(`Validation failed: ${errorMessage}`);
    }
    const data = await graphqlRequest(UPDATE_PRODUCT, { id, product: validation.data });
    return data?.updateProduct ?? null;
}
