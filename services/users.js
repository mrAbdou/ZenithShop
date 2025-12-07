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

export async function fetchUsers() {
    const { data } = await client.query({
        query: GET_USERS,
    });
    return data?.users ?? [];
}
export async function fetchUser(id) {
    const { data } = await client.query({
        query: GET_USER,
        variables: {
            id
        },
    });
    return data?.user ?? null;
}
export async function fetchCustomersCount() {
    const { data } = await client.query({
        query: GET_CUSTOMERS_COUNT,
    });
    return data?.customersCount ?? 0;
}
export async function fetchUsersCount() {
    const { data } = await client.query({
        query: GET_USERS_COUNT,
    });
    return data?.usersCount ?? 0;
}
