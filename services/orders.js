import client from '@/lib/apollo-client.client';
import { CreateOrderSchema, safeValidate } from '@/lib/zodSchemas';
import { gql } from '@apollo/client';
import toast from 'react-hot-toast';
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
export const ADD_ORDER = gql`
mutation AddOrder($items: [OrderItemInput!]!, $total: Decimal!){
    addOrder(items: $items, total: $total){
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
export async function addOrder(new_order) {
    console.log('new order from the service addOrder : ', new_order);
    const validation = safeValidate(CreateOrderSchema, new_order);
    if (!validation.success) {
        throw new Error(validation.error.errors.map(error => error.message).join(', '));
    }
    const { data, error } = await client.mutate({
        mutation: ADD_ORDER,
        variables: validation.data
    })
    if (error) {
        throw error;
    }
    return data?.addOrder ?? null;
}

