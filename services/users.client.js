import { graphqlRequest } from '@/lib/graphql-client';
import { UpdateCustomerSchema } from '@/lib/schemas/user.schema';
import { gql } from 'graphql-request';
import { authClient } from "@/lib/auth-client";
import { LIMIT } from '@/lib/constants';
import ZodValidationError from '@/lib/ZodValidationError';

export const GET_USERS = gql`
query GetUsers($searchQuery: String, $role: Role, $startDate: DateTime, $endDate: DateTime, $sortBy: String, $sortDirection: String, $currentPage: Int!, $limit: Int!) {
    users(searchQuery: $searchQuery, role: $role, startDate: $startDate, endDate: $endDate, sortBy: $sortBy, sortDirection: $sortDirection, currentPage: $currentPage, limit: $limit) {
        id
        name
        email
        role
    }
}
`;
export const GET_USER = gql`
query GetUser($id: String) {
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
export const COMPLETE_SIGNUP = gql`
mutation CompleteSignUp($phoneNumber: String!, $address: String!, $role: Role!){
    completeSignUp(phoneNumber: $phoneNumber, address: $address, role: $role){
        id
        name
        email
        phoneNumber
        address
        role
    }
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
export const UPDATE_USER_PROFILE = gql`
mutation UpdateUserProfile($id: String, $name: String, $phoneNumber: String, $address: String) {
    updateUserProfile(id: $id, name: $name, phoneNumber: $phoneNumber, address: $address){
        id
        name
        email
        phoneNumber
        address
        role
    }
}`;
export async function fetchUsers(variables = { limit: LIMIT, currentPage: 1 }) {
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
export async function completeSignUp(variables) {
    try {
        const data = await graphqlRequest(COMPLETE_SIGNUP, variables);
        return data?.completeSignUp ?? null;
    } catch (catchError) {
        throw catchError;
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
// this function doesn't use the apollo client at all , it uses better auth updateUser because of the fields related to better auth , these fields should be updated in the better auth user, and only by it so the work still be perfect
export async function updateCustomerProfile(variables) {
    try {
        const data = await graphqlRequest(UPDATE_USER_PROFILE, variables);
        return data?.updateUserProfile ?? false;
    } catch (err) {
        throw err;
    }
}
