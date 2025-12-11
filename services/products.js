import client from '@/lib/apollo-client.client';
import { LIMIT } from '@/lib/constants';
import { gql } from '@apollo/client';
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
    const { data, error } = await client.query({
        query: GET_PRODUCTS,
        variables: {
            limit,
            offset
        },
    });
    if (error) {
        console.log('fetch products service ERRORS:', JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
    return data?.products ?? [];
}
export async function fetchProduct(id) {
    const { data, error } = await client.query({
        query: GET_PRODUCT,
        variables: {
            id
        }
    });
    if (error) {
        throw new Error(error.message);
    }
    return data?.product ?? null;
}
export async function fetchProductsCount() {
    const { data, error } = await client.query({
        query: GET_PRODUCTS_COUNT,
    });
    if (error) {
        throw new Error(error.message);
    }
    return data?.productsCount ?? 0;
}
export async function fetchAvailableProductsCount() {
    const { data, error } = await client.query({
        query: GET_AVAILABLE_PRODUCTS_COUNT,
    });
    return data?.availableProductsCount ?? 0;
}
export async function fetchProductsInCart(cart) {
    const { data, error } = await client.query({
        query: GET_PRODUCTS_IN_CART,
        variables: {
            cart
        }
    });
    if (error) {
        console.log('ERRORS:', JSON.stringify(error, null, 2));
        throw new Error(error.message);
    }
    return data?.productsInCart ?? [];
}
export async function addProduct(newProduct) {
    const { data, error } = await client.mutate({
        mutation: ADD_PRODUCT,
        variables: {
            newProduct
        }
    })
    return data?.addNewProduct ?? null;
}
