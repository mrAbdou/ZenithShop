import { getServerApolloClient } from '@/lib/apollo-client.server';
import { gql } from '@apollo/client';

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
export const UPDATE_CUSTOMER_PROFILE = gql`
mutation UpdateCustomerProfile($updatedUser: UpdateUserInput!){
    updateCustomerProfile(updatedUser: $updatedUser){
        id
        name
        email
        phoneNumber
        address
    }
}`;
export async function fetchUsers() {
    try {
        const client = await getServerApolloClient();
        const { data, error } = await client.query({
            query: GET_USERS,
        });
        if (error) {
            throw error;
        }
        return data?.users ?? [];
    } catch (err) {
        throw err;
    }
}
export async function fetchUser(id) {
    try {
        const client = await getServerApolloClient();
        const { data, error } = await client.query({
            query: GET_USER,
            variables: {
                id
            },
        });
        if (error) {
            throw error;
        }
        return data?.user ?? null;
    } catch (err) {
        throw err;
    }
}
export async function fetchCustomersCount() {
    try {
        const client = await getServerApolloClient();
        const { data, error } = await client.query({
            query: GET_CUSTOMERS_COUNT,
        });
        if (error) {
            throw error;
        }
        return data?.customersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function fetchUsersCount() {
    const client = await getServerApolloClient();
    const { data, error } = await client.query({
        query: GET_USERS_COUNT,
    });
    if (error) {
        throw error;
    }
    return data?.usersCount ?? 0;
}
export async function completeSignUp(phoneNumber, address, role) {
    try {
        const client = await getServerApolloClient();
        const { data, error } = await client.mutate({
            mutation: COMPLETE_SIGNUP,
            variables: {
                phoneNumber,
                address,
                role,
            },
        });
        if (error) {
            throw error;
        }
        return data?.completeSignUp ?? null;
    } catch (catchError) {
        throw catchError;
    }
}
export async function fetchMyOrders(cookieHeader) {
    try {
        const client = await getServerApolloClient(cookieHeader);
        const { data, error } = await client.query({
            query: MY_ORDERS,
        });
        if (error) {
            throw error;
        }
        return data?.myOrders ?? [];
    } catch (err) {
        throw err;
    }
}
export async function updateCustomerProfile(updatedUser) {
    try {
        const client = await getServerApolloClient();
        const { data, error } = await client.mutate({
            mutation: UPDATE_CUSTOMER_PROFILE,
            variables: {
                updatedUser
            },
        });
        if (error) {
            throw error;
        }
        return data?.updateCustomerProfile ?? null;
    } catch (err) {
        throw err;
    }
}
