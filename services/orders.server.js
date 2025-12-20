import { graphqlServerRequest } from '@/lib/graphql-server';
import { OrderFilterSchema, safeValidate } from '@/lib/zodSchemas';
import { OrderStatus } from '@prisma/client';
import { gql } from 'graphql-request';
export const GET_ORDERS = gql`
query GetOrders($searchQuery: String, $status: OrderStatus, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String) {
    orders(searchQuery: $searchQuery, status: $status, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection) {
        id
        status
        total
        user {
            name
        }
        items {
            id
        }
        createdAt
    }
}`;
export const GET_ORDER = gql`
query GetOrder($id: String!) {
    order(id: $id) {
        id
        status
        createdAt
        updatedAt
        total
        user {
            name
            email
            phoneNumber
            address
        }
        items {
            id
            qte
            product {
                name
                price
            }
        }
    }
}`;
// i don't think that server can do the add of an order even if it's possible i don't want to do it
// export const ADD_ORDER = gql`
// mutation AddOrder($items: [OrderItemInput!]!, $total: Decimal!){
//     addOrder(items: $items, total: $total){
//         id
//         status
//         createdAt
//         updatedAt
//     }
// }`;
export const GET_ORDERS_COUNT = gql`
query GetOrdersCount {
    ordersCount
}`;
export const GET_ACTIVE_ORDERS_COUNT = gql`
query GetActiveOrdersCount {
    activeOrdersCount
}`;
export async function fetchOrders(cookieHeader = '', filters = { searchQuery: '', status: OrderStatus.PENDING, startDate: null, endDate: null, sortBy: null, sortDirection: null, limit: 1, currentPage: 1 }) {
    try {
        const validation = safeValidate(OrderFilterSchema, filters)
        if (!validation.success) {
            throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
        }
        const data = await graphqlServerRequest(GET_ORDERS, validation.data, cookieHeader);
        return data?.orders ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchOrder(id, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ORDER, { id }, cookieHeader);
        return data?.order ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchOrdersCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ORDERS_COUNT, {}, cookieHeader);
        return data?.ordersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchActiveOrdersCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ACTIVE_ORDERS_COUNT, {}, cookieHeader);
        return data?.activeOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
