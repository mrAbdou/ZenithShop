/**
 * @file services/users.client.js
 * @description Production-ready GraphQL queries and service functions for user-related operations.
 * This file contains all GraphQL queries and service functions for fetching user data,
 * including user lists, individual user details, counts, and orders. All queries are aligned
 * with the backend schemas defined in `app/graphql/TypeDefinitions.js`.
 *
 * @exports
 * - GraphQL Queries: GET_USERS, GET_USER, GET_CUSTOMERS_COUNT, GET_USERS_COUNT, MY_ORDERS, UPDATE_USER_PROFILE
 * - Service Functions: fetchUsers, fetchUser, fetchCustomersCount, fetchUsersCount, fetchMyOrders, updateCustomerProfile
 *
 * @dependencies
 * - @/lib/graphql-client: Provides the `graphqlRequest` function for executing GraphQL queries.
 * - graphql-request: Provides the `gql` template literal tag for defining GraphQL queries.
 * - @/lib/auth-client: Provides the `authClient` for handling authentication-related operations.
 * - @/lib/constants: Provides constants like `LIMIT` for pagination.
 * - @/lib/ZodValidationError: Provides custom error handling for validation errors.
 *
 * @notes
 * - All functions handle errors by propagating them to the caller.
 * - Default values are provided for optional parameters (e.g., `variables` objects).
 * - Null checks are implemented to return appropriate defaults (e.g., empty arrays, 0).
 * - The `updateCustomerProfile` function now sends a GraphQL request to the backend instead of directly updating the user.
 */

import { graphqlRequest } from '@/lib/graphql-client';
import { gql } from 'graphql-request';
import { LIMIT } from '@/lib/constants';

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
        image
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
export const FILTERED_USERS_COUNT = gql`
query GetFilteredUsersCount($searchQuery: String, $role: Role, $startDate: DateTime, $endDate: DateTime) {
    filteredUsersCount(searchQuery: $searchQuery, role: $role, startDate: $startDate, endDate: $endDate)
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
export const UPDATE_CUSTOMER_PROFILE = gql`
mutation UpdateCustomerProfile($id: String, $name: String, $phoneNumber: String, $address: String) {
    updateCustomerProfile(id: $id, name: $name, phoneNumber: $phoneNumber, address: $address){
        id
        name
        email
        phoneNumber
        address
        role
    }
}`;

export const DELETE_CUSTOMER_PROFILE = gql`
mutation DeleteCustomerProfile($userId: String!) {
    deleteCustomerProfile(userId: $userId) {
        id
        name
        email
        role
    }
}`;

export const UPDATE_USER_IMAGE = gql`
mutation UpdateUserImage($imageUrl: String!) {
    updateUserImage(imageUrl: $imageUrl) {
        id
        image
    }
}`;
//TODO: i changed the signature of this function, instead of filters been passed 
//TODO: fix all the calls to this function to be adjusted to this new definition
export async function fetchUsers(variables) {
    try {
        const data = await graphqlRequest(GET_USERS, variables);
        return data?.users ?? [];
    } catch (err) {
        throw err;
    }
}
export async function fetchUser(variables) {
    try {
        const data = await graphqlRequest(GET_USER, variables);
        return data?.user ?? null;
    } catch (err) {
        throw err;
    }
}
export async function fetchCustomersCount(variables = {}) {
    try {
        const data = await graphqlRequest(GET_CUSTOMERS_COUNT, variables);
        return data?.customersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function fetchUsersCount(variables = {}) {
    try {
        const data = await graphqlRequest(GET_USERS_COUNT, variables);
        return data?.usersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function filteredUsersCount(variables) {
    try {
        const data = await graphqlRequest(FILTERED_USERS_COUNT, variables);
        return data?.filteredUsersCount ?? 0;
    } catch (err) {
        throw err;
    }
}

export async function fetchMyOrders(variables = {}) {
    try {
        const data = await graphqlRequest(MY_ORDERS, variables);
        return data?.myOrders ?? [];
    } catch (err) {
        throw err;
    }
}

export async function updateCustomerProfile(variables) {
    try {
        const data = await graphqlRequest(UPDATE_CUSTOMER_PROFILE, variables);
        return data?.updateCustomerProfile ?? false;
    } catch (err) {
        throw err;
    }
}

export async function deleteUser(variables) {
    try {
        const data = await graphqlRequest(DELETE_CUSTOMER_PROFILE, variables);
        return data?.deleteCustomerProfile ?? null;
    } catch (err) {
        throw err;
    }
}

export async function updateUserImage(variables) {
    try {
        const data = await graphqlRequest(UPDATE_USER_IMAGE, variables);
        return data?.updateUserImage ?? null;
    } catch (err) {
        throw err;
    }
}
