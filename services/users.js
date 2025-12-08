import client from '@/lib/apollo-client';
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
mutation CompleteSignUp($phoneNumber: String!, $address: String!, $cart: [CartItemInput!]!){
    completeSignUp(phoneNumber: $phoneNumber, address: $address, cart: $cart){
        success
        user {
            id
            name
            email
            phoneNumber
            address
        }
        order {
            id
            total
            status
            items {
                id
                qte
                product {
                    name
                    price
                }
            }
        }
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

export async function fetchUsers() {
    const { data, error } = await client.query({
        query: GET_USERS,
    });
    if (error) {
        throw error;
    }
    return data?.users ?? [];
}
export async function fetchUser(id) {
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
}
export async function fetchCustomersCount() {
    const { data, error } = await client.query({
        query: GET_CUSTOMERS_COUNT,
    });
    if (error) {
        throw error;
    }
    return data?.customersCount ?? 0;
}
export async function fetchUsersCount() {
    const { data, error } = await client.query({
        query: GET_USERS_COUNT,
    });
    if (error) {
        throw error;
    }
    return data?.usersCount ?? 0;
}
export async function completeSignUp(phoneNumber, address, cart) {
    const { data, error } = await client.mutate({
        mutation: COMPLETE_SIGNUP,
        variables: {
            phoneNumber,
            address,
            cart,
        },
    });
    if (error) {
        throw error;
    }
    return data?.completeSignUp ?? null;
}
export async function fetchMyOrders() {
    const { data, error } = await client.query({
        query: MY_ORDERS
    });
    if (error) {
        throw error;
    }
    return data?.myOrders ?? [];
}