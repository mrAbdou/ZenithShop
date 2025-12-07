import client from '@/lib/apollo-client';
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
    const { data } = await client.query({
        query: GET_PRODUCTS,
        variables: {
            limit,
            offset
        },
    })
    return data?.products ?? [];
}
export async function fetchProduct(id) {
    const { data } = await client.query({
        query: GET_PRODUCT,
        variables: {
            id
        }
    });
    return data?.product ?? null;
}
export async function fetchProductsCount() {
    const { data } = await client.query({
        query: GET_PRODUCTS_COUNT,
    });
    return data?.productsCount ?? 0;
}
export async function fetchAvailableProductsCount() {
    const { data } = await client.query({
        query: GET_AVAILABLE_PRODUCTS_COUNT,
    });
    return data?.availableProductsCount ?? 0;
}
export async function fetchProductsInCart(cart) {
    const { data } = await client.query({
        query: GET_PRODUCTS_IN_CART,
        variables: {
            cart
        }
    });
    return data?.productsInCart ?? [];
}
export async function addProduct(newProduct) {
    const { data } = await client.mutate({
        mutation: ADD_PRODUCT,
        variables: {
            newProduct
        }
    })
    return data?.addNewProduct ?? null;
}
