import { graphqlRequest } from '@/lib/graphql-client';
import { CreateOrderSchema, OrderFilterSchema, safeValidate } from '@/lib/zodSchemas';
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
export async function fetchOrders(filters) {
    console.log('filters from the service fetchOrders : ', filters);
    try {
        const validation = safeValidate(OrderFilterSchema, filters);
        if (!validation.success) {
            throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
        }
        const { searchQuery, status, startDate, endDate, sortBy, sortDirection } = validation.data;
        const data = await graphqlRequest(GET_ORDERS, { searchQuery, status, startDate, endDate, sortBy, sortDirection });
        return data?.orders ?? [];
    } catch (error) {
        throw error;
    }
}
export async function fetchOrder(id) {
    try {
        const data = await graphqlRequest(GET_ORDER, { id });
        return data?.order ?? null;
    } catch (error) {
        throw error;
    }
}
export async function fetchOrdersCount() {
    try {
        const data = await graphqlRequest(GET_ORDERS_COUNT, {});
        return data?.ordersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchActiveOrdersCount() {
    try {
        const data = await graphqlRequest(GET_ACTIVE_ORDERS_COUNT, {});
        return data?.activeOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function addOrder(new_order) {
    console.log('new order from the service addOrder : ', new_order);
    const validation = safeValidate(CreateOrderSchema, new_order);
    if (!validation.success) {
        throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
    }
    try {
        const data = await graphqlRequest(ADD_ORDER, validation.data);
        return data?.addOrder ?? null;
    } catch (error) {
        throw error;
    }
}
