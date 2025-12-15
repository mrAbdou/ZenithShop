import { graphqlRequest } from '@/lib/graphql-client';
import { safeValidate, UpdateCustomerSchema } from '@/lib/zodSchemas';
import { gql } from 'graphql-request';
import { authClient } from "@/lib/auth-client";

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
export async function fetchUsers() {
    try {
        const data = await graphqlRequest(GET_USERS, {});
        return data?.users ?? [];
    } catch (err) {
        throw err;
    }
}
export async function fetchUser(id) {
    try {
        const data = await graphqlRequest(GET_USER, { id });
        return data?.user ?? null;
    } catch (err) {
        throw err;
    }
}
export async function fetchCustomersCount() {
    try {
        const data = await graphqlRequest(GET_CUSTOMERS_COUNT, {});
        return data?.customersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function fetchUsersCount() {
    try {
        const data = await graphqlRequest(GET_USERS_COUNT, {});
        return data?.usersCount ?? 0;
    } catch (err) {
        throw err;
    }
}
export async function completeSignUp(phoneNumber, address, role) {
    try {
        console.log('complete sign up , service level (graphql-request), passed data are : ', { phoneNumber, address, role });
        const data = await graphqlRequest(COMPLETE_SIGNUP, {
            phoneNumber,
            address,
            role,
        });
        return data?.completeSignUp ?? null;
    } catch (catchError) {
        throw catchError;
    }
}
export async function fetchMyOrders() {
    try {
        const data = await graphqlRequest(MY_ORDERS, {});
        return data?.myOrders ?? [];
    } catch (err) {
        throw err;
    }
}
// this function doesn't use the apollo client at all , it uses better auth updateUser because of the fields related to better auth , these fields should be updated in the better auth user, and only by it so the work still be perfect
export async function updateCustomerProfile(updatedCustomer) {
    try {
        console.log('update customer profile , service level (Better Auth), passed data are : ', updatedCustomer);
        const validation = safeValidate(UpdateCustomerSchema, updatedCustomer);
        if (!validation.success) throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
        const result = await authClient.updateUser(validation.data);
        if (result.error) {
            throw new Error(result.error.message);
        }
        return result.data;
    } catch (err) {
        throw err;
    }
}
