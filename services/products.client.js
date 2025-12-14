import { graphqlRequest } from '@/lib/graphql-client';
import { LIMIT } from '@/lib/constants';
import { gql } from 'graphql-request';
import { AddProductSchema, safeValidate } from '@/lib/zodSchemas';
export const GET_PRODUCTS = gql`
query GetProducts($limit: Int!, $offset: Int!) {
    products(limit: $limit, offset: $offset) {
        id
        name
        description
        qteInStock
        price
        createdAt
    }
}`;
export const GET_PRODUCT = gql`
query GetProduct($id: ID!) {
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
export async function fetchProducts(limit = LIMIT, offset = 0) {
    try {
        const data = await graphqlRequest(GET_PRODUCTS, { limit, offset });
        return data?.products ?? [];
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function fetchProduct(id) {
    try {
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
