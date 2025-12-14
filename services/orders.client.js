import { graphqlRequest } from '@/lib/graphql-client';
import { CreateOrderSchema, safeValidate } from '@/lib/zodSchemas';
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
export async function fetchOrders(searchQuery = '', status = OrderStatus.PENDING, startDate = null, endDate = null, sortBy = null, sortDirection = null) {
    console.log('filters from the service fetchOrders : ', searchQuery, status, startDate, endDate, sortBy, sortDirection);
    try {
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
        throw new Error(validation.error.errors.map(error => error.message).join(', '));
    }
    try {
        const data = await graphqlRequest(ADD_ORDER, validation.data);
        return data?.addOrder ?? null;
    } catch (error) {
        throw error;
    }
}

