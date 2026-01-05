/**
 * @file services/users.server.js
 * @description Production-ready GraphQL queries and service functions for user-related operations.
 * This file contains all GraphQL queries and service functions for fetching user data,
 * including user lists, individual user details, counts, and orders. All queries are aligned
 * with the backend schemas defined in `app/graphql/TypeDefinitions.js`.
 *
 * @exports
 * - GraphQL Queries: GET_USERS, GET_USER, GET_CUSTOMERS_COUNT, GET_USERS_COUNT, MY_ORDERS
 * - Service Functions: fetchUsers, fetchUser, fetchCustomersCount, fetchUsersCount, fetchMyOrders
 *
 * @dependencies
 * - @/lib/graphql-server: Provides the `graphqlServerRequest` function for executing GraphQL queries.
 * - graphql-request: Provides the `gql` template literal tag for defining GraphQL queries.
 *
 * @notes
 * - All functions handle errors by propagating them to the caller.
 * - Default values are provided for optional parameters (e.g., `cookieHeader`).
 * - Null checks are implemented to return appropriate defaults (e.g., empty arrays, 0).
 */

import { LIMIT } from '@/lib/constants';
import { graphqlServerRequest } from '@/lib/graphql-server';
import { gql } from 'graphql-request';

export const GET_USERS = gql`
query GetUsers($searchQuery: String, $role: Role, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $currentPage: Int!, $limit: Int!) {
    users(searchQuery: $searchQuery, role: $role, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, currentPage: $currentPage, limit: $limit) {
        id
        name
        email
        role
        createdAt
    }
}
`;
export const GET_USER = gql`
query GetUser($id: String!) {
    user(id: $id) {
        id
        name
        email
        phoneNumber
        address
        role
    }
}`;
export const GET_CUSTOMERS_COUNT = gql`
query GetCustomersCount {
    customersCount
}`;
export const GET_USERS_COUNT = gql`
query GetUsersCount {
    usersCount
}`;

export const MY_ORDERS = gql`
query MyOrders{
    myOrders{
        id
        status
        total
        createdAt
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

export async function fetchUsers(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_USERS, variables, cookieHeader);
        return data?.users ?? [];
    } catch (err) {
        throw err;
    }
}
export async function fetchUser(variables, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_USER, variables, cookieHeader);
        return data?.user ?? null;
    } catch (err) {
        throw err;
    }
}
export async function fetchCustomersCount(variables = {}, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_CUSTOMERS_COUNT, variables, cookieHeader);
        return data?.customersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function fetchUsersCount(variables = {}, cookieHeader) {
    try {
        const data = await graphqlServerRequest(GET_USERS_COUNT, variables, cookieHeader);
        return data?.usersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function fetchMyOrders(variables = {}, cookieHeader) {
    try {
        const data = await graphqlServerRequest(MY_ORDERS, variables, cookieHeader);
        return data?.myOrders ?? [];
    } catch (err) {
        throw err;
    }
}
