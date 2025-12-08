import client from '@/lib/apollo-client';
import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
query GetOrders {
    orders {
        id
        status
        createdAt
        updatedAt
    }
}`;
export const GET_ORDER = gql`
query GetOrder($id: ID!) {
    order(id: $id) {
        id
        status
        createdAt
        updatedAt
    }
}`;
export const GET_ORDERS_COUNT = gql`
query GetOrdersCount {
    ordersCount
}`;
export const GET_ACTIVE_ORDERS_COUNT = gql`
query GetActiveOrdersCount {
    activeOrdersCount
}`;
export const COMPLETE_ORDER_FOR_SIGNED_IN_CUSTOMER = gql`
mutation OrderCreation($cart: [CartItemInput!]!) {
    completeOrder(cart: $cart) {
        id
        status
        createdAt
        total
        user {
            id
            name
            email
        }
        items {
            id
            qte
            product {
                id
                name
                price
            }
        }
    }
}`;
export async function fetchOrders() {
    const { data, error } = await client.query({
        query: GET_ORDERS,
    })
    if (error) {
        throw error;
    }
    return data?.orders ?? [];
}
export async function fetchOrder(id) {
    const { data, error } = await client.query({
        query: GET_ORDER,
        variables: {
            id
        }
    })
    if (error) {
        throw error;
    }
    return data?.order ?? null;
}
export async function fetchOrdersCount() {
    const { data, error } = await client.query({
        query: GET_ORDERS_COUNT,
        fetchPolicy: 'network-only',
    })
    if (error) {
        throw error;
    }
    return data?.ordersCount ?? 0;
}
export async function fetchActiveOrdersCount() {
    const { data, error } = await client.query({
        query: GET_ACTIVE_ORDERS_COUNT,
    })
    if (error) {
        throw error;
    }
    return data?.activeOrdersCount ?? 0;
}
export async function completeOrderForSignedInCustomer(cart) {
    console.log('from completeOrderForSignedInCustomer service :', { cart });
    const { data, error } = await client.mutate({
        mutation: COMPLETE_ORDER_FOR_SIGNED_IN_CUSTOMER,
        variables: {
            cart
        }
    })
    if (error) {
        throw error;
    }
    return data?.completeOrder ?? null;
}
