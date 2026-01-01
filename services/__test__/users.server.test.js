import dotenv from 'dotenv';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    fetchUsers,
    fetchUser,
    fetchCustomersCount,
    fetchUsersCount,
    fetchMyOrders,
    GET_USERS,
    GET_USER,
    GET_CUSTOMERS_COUNT,
    GET_USERS_COUNT,
    MY_ORDERS
} from '@/services/users.server';
import { graphqlServerRequest } from '@/lib/graphql-server';
import { GraphQLError } from 'graphql';
import { OrderStatus, Role } from '@prisma/client';

dotenv.config();

// Mock the dependency
vi.mock('@/lib/graphql-server.js', () => ({
    graphqlServerRequest: vi.fn(),
}));

describe('users.server.js Service Functions', () => {

    // Clear mocks before each test to ensure clean state
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchUsers', () => {
        const mockUsers = [
            {
                id: 'admin01',
                name: 'admin',
                email: 'admin@system.com',
                role: Role.ADMIN,
            }
        ];

        it('should call graphqlServerRequest with correct arguments and return users', async () => {
            graphqlServerRequest.mockResolvedValueOnce({ users: mockUsers });

            const variables = { currentPage: 1, limit: 10, searchQuery: "test" };
            const cookieHeader = 'auth=token';

            const result = await fetchUsers(variables, cookieHeader);

            expect(graphqlServerRequest).toHaveBeenCalledTimes(1);
            expect(graphqlServerRequest).toHaveBeenCalledWith(GET_USERS, variables, cookieHeader);
            expect(result).toEqual(mockUsers);
        });

        it('should return empty array if response is null/undefined', async () => {
            graphqlServerRequest.mockResolvedValueOnce({}); // No users property
            const result = await fetchUsers({});
            expect(result).toEqual([]);

            graphqlServerRequest.mockResolvedValueOnce(null); // Null response
            const result2 = await fetchUsers({});
            expect(result2).toEqual([]);
        });

        it('should propagate errors correctly', async () => {
            const error = new GraphQLError('Unauthorized');
            graphqlServerRequest.mockRejectedValueOnce(error);
            await expect(fetchUsers({})).rejects.toThrow('Unauthorized');
        });
    });

    describe('fetchUser', () => {
        const mockUser = {
            id: 'user1',
            name: 'Test User',
            role: Role.CUSTOMER
        };

        it('should call graphqlServerRequest with correct arguments and return user', async () => {
            graphqlServerRequest.mockResolvedValueOnce({ user: mockUser });

            const variables = { id: 'user1' };
            const cookieHeader = 'auth=token';
            await fetchUser(variables, cookieHeader);

            expect(graphqlServerRequest).toHaveBeenCalledWith(GET_USER, variables, cookieHeader);
        });

        it('should return null if user is not found', async () => {
            graphqlServerRequest.mockResolvedValueOnce({ user: null });
            const result = await fetchUser({ id: 'id' });
            expect(result).toBeNull();
        });
    });

    describe('fetchCustomersCount', () => {
        it('should return the count', async () => {
            graphqlServerRequest.mockResolvedValueOnce({ customersCount: 42 });
            const result = await fetchCustomersCount();
            expect(result).toBe(42);
            expect(graphqlServerRequest).toHaveBeenCalledWith(GET_CUSTOMERS_COUNT, {}, '');
        });

        it('should return 0 if count is missing', async () => {
            graphqlServerRequest.mockResolvedValueOnce({});
            const result = await fetchCustomersCount();
            expect(result).toBe(0);
        });
    });

    describe('fetchUsersCount', () => {
        it('should return the count', async () => {
            graphqlServerRequest.mockResolvedValueOnce({ usersCount: 100 });
            const result = await fetchUsersCount();
            expect(result).toBe(100);
            expect(graphqlServerRequest).toHaveBeenCalledWith(GET_USERS_COUNT, {}, '');
        });

        it('should return 0 if count is missing', async () => {
            graphqlServerRequest.mockResolvedValueOnce({});
            const result = await fetchUsersCount();
            expect(result).toBe(0);
        });
    });

    describe('fetchMyOrders', () => {

        it('should call graphqlServerRequest with correct arguments', async () => {
            graphqlServerRequest.mockResolvedValueOnce({
                myOrders: [
                    {
                        id: 'order1',
                        userId: 'customer1',
                        status: OrderStatus.PENDING,
                        items: [{
                            productId: 'product1',
                            qte: 2,
                        }],
                        total: 20,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                ]
            });
            const cookieHeader = 'auth=token';
            const variables = {};
            const result = await fetchMyOrders(variables, cookieHeader);
            expect(result).toEqual([
                {
                    id: 'order1',
                    userId: 'customer1',
                    status: OrderStatus.PENDING,
                    items: [{
                        productId: 'product1',
                        qte: 2,
                    }],
                    total: 20,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                }
            ]);
            expect(graphqlServerRequest).toHaveBeenCalledWith(MY_ORDERS, variables, cookieHeader);
        });

        it('should return empty array if no orders found', async () => {
            graphqlServerRequest.mockResolvedValueOnce({});
            const result = await fetchMyOrders({}, 'token');
            expect(result).toEqual([]);
        });
    });
});
