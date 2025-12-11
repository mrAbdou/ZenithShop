import client from '@/lib/apollo-client.client';
import { safeValidate, UpdateCustomerSchema } from '@/lib/zodSchemas';
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
mutation UpdateCustomerProfile($updatedCustomer: UpdateCustomerInput!){
    updateCustomerProfile(updatedCustomer: $updatedCustomer){
        id
        name
        email
        phoneNumber
        address
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
export async function completeSignUp(phoneNumber, address, role) {
    try {
        console.log('complete sign up , service level (Apollo Client), passed data are : ', { phoneNumber, address, role });
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
export async function fetchMyOrders() {
    try {
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
export async function updateCustomerProfile(updatedCustomer) {
    try {
        console.log('update customer profile , service level (Apollo Client), passed data are : ', updatedCustomer);
        const validation = safeValidate(UpdateCustomerSchema, updatedCustomer);
        if (!validation.success) throw new Error(validation.error.errors.map(e => e.message).join(', '));
        const { data, error } = await client.mutate({
            mutation: UPDATE_CUSTOMER_PROFILE,
            variables: {
                updatedCustomer: validation.data
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