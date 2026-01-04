import { graphqlRequest } from '@/lib/graphql-client';
import { CreateOrderSchema, OrderFilterSchema } from '@/lib/schemas/order.schema';
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
export const UPDATE_ORDER = gql`
mutation UpdateOrder($id: String!, $status: OrderStatus!) {
    updateOrder(id: $id, status: $status) {
        id
        status
    }
}`;
export const DELETE_ORDER = gql`
mutation DeleteOrder($id: String!) {
    deleteOrder(id: $id) {
        id
        status
    }
}`;
export const FILTERED_ORDERS_COUNT = gql`
query FilteredOrdersCount($searchQuery: String, $status: OrderStatus, $startDate: DateTime, $endDate: DateTime){
    filteredOrdersCount(searchQuery: $searchQuery, status: $status, startDate: $startDate, endDate: $endDate)
}`;
export async function fetchOrders(variables) {
    try {
        const data = await graphqlRequest(GET_ORDERS, variables);
        return data?.orders ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchOrder(variables) {
    try {
        const data = await graphqlRequest(GET_ORDER, variables);
        return data?.order ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchOrdersCount(variables = {}) {
    try {
        const data = await graphqlRequest(GET_ORDERS_COUNT, variables);
        return data?.ordersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchActiveOrdersCount(variables = {}) {
    try {
        const data = await graphqlRequest(GET_ACTIVE_ORDERS_COUNT, variables);
        return data?.activeOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function addOrder(variables) {
    try {
        console.log(variables);
        const data = await graphqlRequest(ADD_ORDER, variables);
        return data?.addOrder ?? null;
    } catch (error) {
        throw error;
    }
}
export async function updateOrder(variables) {
    try {
        const data = await graphqlRequest(UPDATE_ORDER, variables);
        return data?.updateOrder ?? null;
    } catch (error) {
        throw error
    }
}
export async function deleteOrder(variables) {
    try {
        const data = await graphqlRequest(DELETE_ORDER, variables);
        return data?.deleteOrder ?? null;
    } catch (error) {
        throw error;
    }
}
export async function filteredOrdersCount(variables) {
    try {
        const data = await graphqlRequest(FILTERED_ORDERS_COUNT, variables);
        return data?.filteredOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}