import dotenv from 'dotenv';
dotenv.config();
import { describe, vi, expect, it, beforeEach } from 'vitest';
import { fetchUsers, fetchUser, fetchCustomersCount, fetchUsersCount, completeSignUp, fetchMyOrders, updateCustomerProfile, MY_ORDERS } from '@/services/users.client';
import { GET_USERS, GET_USER, GET_CUSTOMERS_COUNT, GET_USERS_COUNT, COMPLETE_SIGNUP, UPDATE_CUSTOMER_PROFILE } from '@/services/users.client';
import { graphqlRequest } from '@/lib/graphql-client';
import { Role } from '@prisma/client';
import { LIMIT } from '@/lib/constants';
import { GraphQLError } from 'graphql';

vi.mock('@/lib/graphql-client', () => ({
    graphqlRequest: vi.fn()
}));

describe('users.client.js', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // ========================================
    // fetchUsers function tests
    // ========================================
    describe('fetchUsers tests', () => {
        it('should return a list of users when no variable is provided (default variables are used)', async () => {
            graphqlRequest.mockResolvedValueOnce({
                users: [
                    {
                        id: 'user01',
                        name: 'user',
                        email: 'user@system.com',
                        role: Role.CUSTOMER,
                        orders: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                ]
            });
            const variables = { currentPage: 1, limit: LIMIT };
            const users = await fetchUsers();
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS, variables);
            expect(users).toBeInstanceOf(Array);
            expect(users).toMatchObject([
                {
                    id: 'user01',
                    name: 'user',
                    email: 'user@system.com',
                    role: Role.CUSTOMER,
                    orders: [],
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }
            ]);
        });

        it('should return a list of users when variable is provided with search query', async () => {
            graphqlRequest.mockResolvedValueOnce({
                users: [
                    {
                        id: 'user01',
                        name: 'user',
                        email: 'user@system.com',
                        role: Role.CUSTOMER,
                        orders: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                ]
            });
            const variables = { searchQuery: 'user', currentPage: 1, limit: LIMIT };
            const users = await fetchUsers(variables);
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS, variables);
            expect(users).toBeInstanceOf(Array);
            expect(users).toMatchObject([
                {
                    id: 'user01',
                    name: 'user',
                    email: 'user@system.com',
                    role: Role.CUSTOMER,
                    orders: [],
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }
            ]);
        });

        it('should return empty list when there is no user match that search query', async () => {
            graphqlRequest.mockResolvedValueOnce({
                users: []
            });
            const variables = { searchQuery: 'user', currentPage: 1, limit: LIMIT };
            const users = await fetchUsers(variables);
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS, variables);
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(0);
        });

        it('should throw an error when variables missing limit', async () => {
            const errors = [
                {
                    field: 'limit',
                    message: 'Limit should be a number'
                }
            ]
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } }));
            const variables = { currentPage: 1 };
            try {
                await fetchUsers(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual(errors);
            }
        });
    });

    // ========================================
    // fetchUser function tests
    // ========================================
    describe('fetchUser tests', () => {
        it('should return a user when id is provided', async () => {
            graphqlRequest.mockResolvedValueOnce({
                user: {
                    id: 'user01',
                    name: 'user',
                    email: 'user@system.com',
                    role: Role.CUSTOMER,
                    orders: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
            const variables = { id: 'user01' };
            const user = await fetchUser(variables);
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USER, variables);
            expect(user).toBeInstanceOf(Object);
            expect(user).toMatchObject({
                id: 'user01',
                name: 'user',
                email: 'user@system.com',
                role: Role.CUSTOMER,
                orders: [],
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should throw an error when id is not provided', async () => {
            const errors = [
                {
                    field: 'id',
                    message: 'Invalid user id'
                }
            ]
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } }));
            const variables = {};
            try {
                await fetchUser(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(graphqlRequest).toHaveBeenCalledWith(GET_USER, variables);
                expect(error.extensions.errors).toEqual(errors);
            }
        });

        it('should throw an error when you provide an id but user not found', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } }));
            const variables = { id: 'user0_1' };
            try {
                await fetchUser(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('User not found');
                expect(error.extensions.code).toBe('NOT_FOUND');
                expect(graphqlRequest).toHaveBeenCalledWith(GET_USER, variables);
            }
        });
    });

    // ========================================
    // fetchCustomersCount function tests
    // ========================================
    describe('fetchCustomersCount tests', () => {
        it('should return the number of customer in the DB', async () => {
            graphqlRequest.mockResolvedValueOnce({
                customersCount: 1
            });
            const customersCount = await fetchCustomersCount();
            expect(graphqlRequest).toHaveBeenCalledWith(GET_CUSTOMERS_COUNT, {});
            expect(customersCount).toBeTypeOf('number');
            expect(customersCount).toBe(1);
        });

        it('should return 0 when there is no customer in the DB', async () => {
            graphqlRequest.mockResolvedValueOnce({
                customersCount: 0
            });
            const customersCount = await fetchCustomersCount();
            expect(graphqlRequest).toHaveBeenCalledWith(GET_CUSTOMERS_COUNT, {});
            expect(customersCount).toBeTypeOf('number');
            expect(customersCount).toBe(0);
        });

        it('should throw an error when fetching customers count fails due to database connection issues', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Internal server error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } }));
            try {
                await fetchCustomersCount();
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Internal server error');
                expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
                expect(graphqlRequest).toHaveBeenCalledWith(GET_CUSTOMERS_COUNT, {});
            }
        });
    });

    // ========================================
    // fetchUsersCount function tests
    // ========================================
    describe('fetchUsersCount tests', () => {
        it('should return the number of users in the DB', async () => {
            graphqlRequest.mockResolvedValueOnce({
                usersCount: 1
            });
            const usersCount = await fetchUsersCount();
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS_COUNT, {});
            expect(usersCount).toBeTypeOf('number');
            expect(usersCount).toBe(1);
        });

        it('should return 0 when there is no user in the DB', async () => {
            graphqlRequest.mockResolvedValueOnce({
                usersCount: 0
            });
            const usersCount = await fetchUsersCount();
            expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS_COUNT, {});
            expect(usersCount).toBeTypeOf('number');
            expect(usersCount).toBe(0);
        });

        it('should throw an error when fetching users count fails due to database connection issues', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Database connection failed', { extensions: { code: 'INTERNAL_SERVER_ERROR' } }));
            try {
                await fetchUsersCount();
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Database connection failed');
                expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
                expect(graphqlRequest).toHaveBeenCalledWith(GET_USERS_COUNT, {});
            }
        });
    });

    // ========================================
    // completeSignUp function tests
    // ========================================
    describe('completeSignUp tests', () => {
        it('should return the updated user information when new values are correctly provided', async () => {
            graphqlRequest.mockResolvedValueOnce({
                completeSignUp: {
                    id: 'user01',
                    name: 'john doe',
                    email: 'john@doe.com',
                    phoneNumber: '0000000001',
                    address: 'updated address',
                    role: Role.CUSTOMER,
                    orders: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
            const variables = { phoneNumber: '0000000001', address: 'updated address', role: Role.CUSTOMER };
            const user = await completeSignUp(variables);
            expect(user).toBeInstanceOf(Object);
            expect(graphqlRequest).toHaveBeenCalledWith(COMPLETE_SIGNUP, variables);
            expect(user).toMatchObject({
                id: 'user01',
                name: 'john doe',
                email: 'john@doe.com',
                phoneNumber: '0000000001',
                address: 'updated address',
                role: Role.CUSTOMER,
                orders: [],
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should throw an error when new values are partially missed', async () => {
            const errors = [
                {
                    field: 'phoneNumber',
                    message: 'Phone number is required as String'
                },
            ]
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } }));
            const variables = { phoneNumber: '0000000001' };
            try {
                await completeSignUp(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual(errors);
            }
        });

        it('should throw an error when there is no customer session', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } }));
            const variables = { phoneNumber: '0000000001', address: 'new address' };
            try {
                await completeSignUp(variables);
                expect.fail('shoulb have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(graphqlRequest).toHaveBeenCalledWith(COMPLETE_SIGNUP, variables);
            }
        });

        it('should throw an error when new customer data provided correctly but no customer found', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('User not found', { extensions: { code: 'USER_NOT_FOUND' } }));
            const variables = { phoneNumber: '0000000001', address: 'new address' };
            try {
                await completeSignUp(variables);
                expect.fail('shoulb have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('User not found');
                expect(error.extensions.code).toBe('USER_NOT_FOUND');
                expect(graphqlRequest).toHaveBeenCalledWith(COMPLETE_SIGNUP, variables);
            }
        });
    });

    // ========================================
    // fetchMyOrders function tests
    // ========================================
    describe('fetchMyOrders tests', () => {
        it('should return a list of orders for the signed in admin (should provide the user id) ', async () => {
            graphqlRequest.mockResolvedValueOnce({
                myOrders: [
                    {
                        id: 'order01',
                        userId: 'user01',
                        status: 'PENDING',
                        items: [
                            {
                                id: 'orderItem01',
                                orderId: 'order01',
                                productId: 'product01',
                                qte: 1,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        ],
                        total: 100,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            });
            const variables = { id: 'user01' }
            const result = await fetchMyOrders(variables)
            expect(graphqlRequest).toHaveBeenCalledWith(MY_ORDERS, variables)
            expect(result).toBeInstanceOf(Array)
            expect(result).toHaveLength(1)
            expect(result).toMatchObject([
                {
                    id: 'order01',
                    userId: 'user01',
                    status: 'PENDING',
                    items: [
                        {
                            id: 'orderItem01',
                            orderId: 'order01',
                            productId: 'product01',
                            qte: 1,
                            createdAt: expect.any(Date),
                            updatedAt: expect.any(Date)
                        }
                    ],
                    total: 100,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            ])
        });

        it('should return a list of orders for the signed in customer (not required to provide a user id) ', async () => {
            graphqlRequest.mockResolvedValueOnce({
                myOrders: [
                    {
                        id: 'order01',
                        userId: 'user01',
                        status: 'PENDING',
                        items: [
                            {
                                id: 'orderItem01',
                                orderId: 'order01',
                                productId: 'product01',
                                qte: 1,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        ],
                        total: 100,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            });
            const variables = {};
            const result = await fetchMyOrders(variables);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toEqual([
                {
                    id: 'order01',
                    userId: 'user01',
                    status: 'PENDING',
                    items: [
                        {
                            id: 'orderItem01',
                            orderId: 'order01',
                            productId: 'product01',
                            qte: 1,
                            createdAt: expect.any(Date),
                            updatedAt: expect.any(Date),
                        }
                    ],
                    total: 100,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }
            ]);
            expect(graphqlRequest).toHaveBeenCalledWith(MY_ORDERS, variables);
        });

        it('should throw an error when fetching orders for an unauthorized user', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } }));
            const variables = {};
            try {
                await fetchMyOrders(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(graphqlRequest).toHaveBeenCalledWith(MY_ORDERS, variables);
            }
        });

        it('should return an empty array when no orders are found', async () => {
            graphqlRequest.mockResolvedValueOnce({ myOrders: [] });
            const variables = {};
            const result = await fetchMyOrders(variables);
            expect(graphqlRequest).toHaveBeenCalledWith(MY_ORDERS, variables);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(0);
        });
    });

    // ========================================
    // updateCustomerProfile function tests
    // ========================================
    describe('updateCustomerProfile tests', () => {
        it('should return true when input is valid', async () => {
            graphqlRequest.mockResolvedValueOnce({
                updateCustomerProfile: true
            });
            const variables = { id: 'user01', name: 'new John Doe', phoneNumber: '0000000001', address: 'updated address' };
            const result = await updateCustomerProfile(variables);
            expect(graphqlRequest).toHaveBeenCalledWith(UPDATE_CUSTOMER_PROFILE, variables);
            expect(result).toBeTruthy();
        });

        it('should throw an error when updating customer profile fails', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Validation error', { extensions: { code: 'VALIDATION_ERROR' } }));
            const variables = { id: 'user01', name: 'new John Doe', phoneNumber: '0000000001', address: 'updated address' };
            try {
                await updateCustomerProfile(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation error');
                expect(error.extensions.code).toBe('VALIDATION_ERROR');
                expect(graphqlRequest).toHaveBeenCalledWith(UPDATE_CUSTOMER_PROFILE, variables);
            }
        });

        it('should throw an error when unauthorized', async () => {
            graphqlRequest.mockRejectedValueOnce(new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } }));
            const variables = { id: 'user01', name: 'new John Doe', phoneNumber: '0000000001', address: 'updated address' };
            try {
                await updateCustomerProfile(variables);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(graphqlRequest).toHaveBeenCalledWith(UPDATE_CUSTOMER_PROFILE, variables);
            }
        });
    });
});
