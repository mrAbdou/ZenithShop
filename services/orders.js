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

export async function fetchOrders() {
    const { data } = await client.query({
        query: GET_ORDERS,
    })
    return data?.orders ?? [];
}
export async function fetchOrder(id) {
    const { data } = await client.query({
        query: GET_ORDER,
        variables: {
            id
        }
    })
    return data?.order ?? null;
}
export async function fetchOrdersCount() {
    const { data } = await client.query({
        query: GET_ORDERS_COUNT,
        fetchPolicy: 'network-only',
    })
    return data?.ordersCount ?? 0;
}
export async function fetchActiveOrdersCount() {
    const { data } = await client.query({
        query: GET_ACTIVE_ORDERS_COUNT,
    })
    return data?.activeOrdersCount ?? 0;
}
