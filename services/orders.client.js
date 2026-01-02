import { graphqlRequest } from '@/lib/graphql-client';
import { CreateOrderSchema, OrderFilterSchema } from '@/lib/schemas/order.schema';
import { gql } from 'graphql-request';
export const GET_ORDERS = gql`
query GetOrders($searchQuery: String, $status: OrderStatus, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $currentPage: Int, $limit: Int, $totalPages: Int) {
    orders(searchQuery: $searchQuery, status: $status, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, currentPage: $currentPage, limit: $limit, totalPages: $totalPages) {
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
export async function fetchOrders(filters) {
    try {
        const validation = OrderFilterSchema.safeParse(filters);
        if (!validation.success) {
            throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
        }
        const { searchQuery, status, startDate, endDate, sortBy, sortDirection, currentPage, limit, totalPages } = validation.data;
        const data = await graphqlRequest(GET_ORDERS, { searchQuery, status, startDate, endDate, sortBy, sortDirection, currentPage, limit, totalPages });
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
    const validation = CreateOrderSchema.safeParse(new_order);
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
export async function updateOrder(variables) {
    try {
        const data = await graphqlRequest(UPDATE_ORDER, variables);
        return data?.updateOrder ?? null;
    } catch (error) {
        throw error
    }
}
export async function deleteOrder(id) {
    try {
        if (!id || typeof id !== 'string') {
            throw new Error('Order ID is not valid');
        }
        const data = await graphqlRequest(DELETE_ORDER, { id });
        return data?.deleteOrder ?? null;
    } catch (error) {
        throw error;
    }
}
export async function filteredOrdersCount(filters) {
    try {
        const data = await graphqlRequest(FILTERED_ORDERS_COUNT, filters);
        return data?.filteredOrdersCount ?? 0;
    } catch (error) {
        throw error;
    }
}