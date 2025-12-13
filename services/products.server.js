import { graphqlServerRequest } from '@/lib/graphql-server';
import { LIMIT } from '@/lib/constants';
import { gql } from 'graphql-request';
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
export async function fetchProducts(limit = LIMIT, offset = 0, cookieHeader = '') {
    console.log('fetchProducts : ', { limit, offset, cookieHeader });
    try {
        const data = await graphqlServerRequest(GET_PRODUCTS, { limit, offset }, cookieHeader);
        return data?.products ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchProduct(id, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_PRODUCT, { id }, cookieHeader);
        return data?.product ?? null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function fetchProductsCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_PRODUCTS_COUNT, {}, cookieHeader);
        return data?.productsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchAvailableProductsCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_AVAILABLE_PRODUCTS_COUNT, {}, cookieHeader);
        return data?.availableProductsCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchProductsInCart(cart, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_PRODUCTS_IN_CART, { cart }, cookieHeader);
        return data?.productsInCart ?? [];
    } catch (error) {
        throw error;
    }
}
export async function addProduct(newProduct, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(ADD_PRODUCT, { newProduct }, cookieHeader);
        return data?.addNewProduct ?? null;
    } catch (error) {
        throw error;
    }
}
