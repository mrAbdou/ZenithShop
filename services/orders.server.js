import { LIMIT } from '@/lib/constants';
import { graphqlServerRequest } from '@/lib/graphql-server';
import { OrderFilterSchema } from '@/lib/schemas/order.schema';
import ZodValidationError from '@/lib/ZodValidationError';
import { OrderStatus } from '@prisma/client';
import { gql } from 'graphql-request';
export const GET_ORDERS = gql`
query GetOrders($searchQuery: String, $status: OrderStatus, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $currentPage: Int!, $limit: Int!) {
    orders(searchQuery: $searchQuery, status: $status, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, currentPage: $currentPage, limit: $limit) {
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
export const FILTERED_ORDERS_COUNT = gql`
query FilteredOrdersCount($searchQuery: String, $status: OrderStatus, $startDate: DateTime, $endDate: DateTime){
    filteredOrdersCount(searchQuery: $searchQuery, status: $status, startDate: $startDate, endDate: $endDate)
}`;
export async function fetchOrders(variables, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ORDERS, variables, cookieHeader);
        return data?.orders ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchOrder(variables, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ORDER, variables, cookieHeader);
        return data?.order ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchOrdersCount(variables = {}, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ORDERS_COUNT, variables, cookieHeader);
        return data?.ordersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchActiveOrdersCount(variables = {}, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_ACTIVE_ORDERS_COUNT, variables, cookieHeader);
        return data?.activeOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function filteredOrdersCount(variables, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(FILTERED_ORDERS_COUNT, variables, cookieHeader);
        return data?.filteredOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
