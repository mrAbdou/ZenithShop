import { graphqlServerRequest } from '@/lib/graphql-server';
import { gql } from 'graphql-request';

export const GET_USERS = gql`
query GetUsers {
    users {
        id
        name
        email
        role
    }
}
`;
export const GET_USER = gql`
query GetUser($id: ID!) {
    user(id: $id) {
        id
        name
        email
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
export async function fetchUsers(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_USERS, {}, cookieHeader);
        return data?.users ?? [];
    } catch (err) {
        throw err;
    }
}
export async function fetchUser(id, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_USER, { id }, cookieHeader);
        return data?.user ?? null;
    } catch (err) {
        throw err;
    }
}
export async function fetchCustomersCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_CUSTOMERS_COUNT, {}, cookieHeader);
        return data?.customersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function fetchUsersCount(cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(GET_USERS_COUNT, {}, cookieHeader);
        return data?.usersCount ?? 0;
    } catch (error) {
        throw error;
    }
}
export async function completeSignUp(phoneNumber, address, role, cookieHeader = '') {
    try {
        const data = await graphqlServerRequest(COMPLETE_SIGNUP, {
            phoneNumber,
            address,
            role,
        }, cookieHeader);
        return data?.completeSignUp ?? null;
    } catch (catchError) {
        throw catchError;
    }
}
export async function fetchMyOrders(cookieHeader) {
    try {
        const data = await graphqlServerRequest(MY_ORDERS, {}, cookieHeader);
        return data?.myOrders ?? [];
    } catch (err) {
        throw err;
    }
}
