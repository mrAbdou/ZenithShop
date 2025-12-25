import { describe, it, expect, vi } from "vitest";
import userQueries from "../queries/users";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";
const createMockContext = (overrides = {}) => ({
    prisma: {
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
        },
        ...overrides.prisma
    },
    session: {
        ...overrides.session,
    },
    ...overrides
});
describe('User Queries', () => {
    describe('Users Resolver Tests', () => {
        it('should return a list of users when the admin is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'cl0293h4r000008l17n9fclba',
                                name: 'john doe',
                                email: 'john.doe@example.com',
                                role: 'ADMIN'
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000008l17n9fclba',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                currentPage: 1,
                limit: 10
            };
            const result = await userQueries.users(null, args, context);
            expect(context.prisma.user.findMany).toHaveBeenCalledWith({
                include: { orders: { include: { items: { include: { product: true } } } } },
                skip: 0,
                take: 10,
                where: {},
                orderBy: {}
            });
            expect(result).toEqual([
                {
                    id: 'cl0293h4r000008l17n9fclba',
                    name: 'john doe',
                    email: 'john.doe@example.com',
                    role: 'ADMIN'
                }
            ]);
        });
        it('should throw an error when trying to get the list of users without authorization of an admin', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
            });
            const args = {};
            try {
                await userQueries.users(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findMany).not.toHaveBeenCalled();
            }

        });
    });
    describe('User Resolver Tests', () => {
        // TODO: Test user with valid customer session (already done)
        it('should return an object that contains user information when that user is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'cl0293h4r000108l17n9fclbb',
                            name: 'jane smith',
                            email: 'jane.smith@example.com',
                            role: Role.CUSTOMER
                        }),
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000108l17n9fclbb',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {};
            const result = await userQueries.user(null, args, context);
            expect(context.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'cl0293h4r000108l17n9fclbb' },
                include: { orders: { include: { items: { include: { product: true } } } } }
            });
            expect(result).toEqual({
                id: 'cl0293h4r000108l17n9fclbb',
                name: 'jane smith',
                email: 'jane.smith@example.com',
                role: Role.CUSTOMER
            });
        });
        // TODO: Test user with non-customer role fails
        it('should throw an error when try to get user information by non-customer role', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findUnique: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000008l17n9fclba',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {};
            try {
                await userQueries.user(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findUnique).not.toHaveBeenCalled();
            }
        });
        // TODO: Test user with no session fails
        it('should throw an error when try to get user information with no session', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findUnique: vi.fn().mockResolvedValue()
                    }
                }
            })
            const args = {};
            try {
                await userQueries.user(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findUnique).not.toHaveBeenCalled();
            }
        });
    });
})

// TODO: Add new describe for 'Customers Count Resolver Tests'
describe('Customer Count Resolver Tests', () => {
    // TODO: Test customersCount with admin session returns count
    it('should return the number of customer account created when the admin is signed in', async () => {
        const context = createMockContext({
            prisma: {
                user: {
                    count: vi.fn().mockResolvedValue(6),
                }
            },
            session: {
                user: {
                    id: 'cl0293h4r000008l17n9fclba',
                    role: Role.ADMIN
                }
            }
        });
        const args = {};
        const result = await userQueries.customersCount(null, args, context);
        expect(result).toBe(6);
        expect(context.prisma.user.count).toHaveBeenCalledWith({
            where: { role: { equals: Role.CUSTOMER } }
        });
    });
    // TODO: Test customersCount with non-admin fails
    it('should throw an error when try to get the number of customer accounts created with customer (non-admin) authorization', async () => {
        const context = createMockContext({
            prisma: {
                user: {
                    count: vi.fn().mockResolvedValue(),
                }
            },
            session: {
                user: {
                    id: 'cl0293h4r000108l17n9fclbb',
                    role: Role.CUSTOMER
                }
            }
        });
        const args = {};
        try {
            await userQueries.customersCount(null, args, context);
            expect.fail('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error.message).toBe('Unauthorized');
            expect(error.extensions.code).toBe('UNAUTHORIZED');
            expect(context.prisma.user.count).not.toHaveBeenCalled();
        }
    })
    // TODO: Test customersCount with no session fails
    it('should throw an error when try to get the number of customer accounts created without admin authorization', async () => {
        const context = createMockContext({
            prisma: {
                user: {
                    count: vi.fn().mockResolvedValue(),
                }
            }
        });
        const args = {};
        try {
            await userQueries.customersCount(null, args, context);
            expect.fail('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error.message).toBe('Unauthorized');
            expect(error.extensions.code).toBe('UNAUTHORIZED');
            expect(context.prisma.user.count).not.toHaveBeenCalled();
        }
    })

})

// TODO: Add new describe for 'Users Count Resolver Tests'
// TODO: Test usersCount with admin session returns count
// TODO: Test usersCount with non-admin fails
// TODO: Test usersCount with no session fails

// TODO: Under 'Users Resolver Tests' - update with new params
// TODO: Test users with valid admin session and pagination/filtering/sorting
// TODO: Test users with valid admin session and various combinations of params
// TODO: Test users returns correct include and data structure
// TODO: Test users with invalid params fails validation
// TODO: Test users with non-admin fails
// TODO: Test users with no session fails
