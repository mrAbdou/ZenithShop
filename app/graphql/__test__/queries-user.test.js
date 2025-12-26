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
//100% tested and proven
describe('User Queries', () => {
    describe('Users Resolver Tests', () => {
        it('should throw an error when the admin is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'cl0293h4r000108l17n9fclbb',
                                name: 'jane smith',
                                email: 'jane.smith@example.com',
                                role: Role.CUSTOMER,
                                orders: []
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
                currentPage: -1,
                limit: 9999
            };
            try {
                await userQueries.users(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    { field: 'currentPage', message: 'Current page must be at least 1' },
                    { field: 'limit', message: 'Limit must be at most 20' }
                ]);
            }
        });
        it('should throw an error when a signed in customer try to get the list of users', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000008l17n9fclba',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                currentPage: 1,
                limit: 10
            };
            try {
                await userQueries.users(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });
        it('should throw an error when a guest try to get the list of users', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                currentPage: 1,
                limit: 10
            };
            try {
                await userQueries.users(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });
        it('should return a list of paginated, sorted, and filtered users when a signed in admin ask for it', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'cl0293h4r000008l17n9fclbB',
                                name: 'JANE SMITH',
                                email: 'jane.smith@example.com',
                                role: Role.CUSTOMER,
                                orders: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclba',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'JANE SMITH',
                role: Role.CUSTOMER,
                startDate: '2025-12-01',
                endDate: '2025-12-31',
                sortBy: 'name',
                sortDirection: 'asc',
                limit: 10,
                currentPage: 1
            };
            let where = {
                OR: [
                    { id: { contains: 'JANE SMITH', mode: 'insensitive' } },
                    { name: { contains: 'JANE SMITH', mode: 'insensitive' } },
                    { email: { contains: 'JANE SMITH', mode: 'insensitive' } }
                ],
                role: Role.CUSTOMER,
                createdAt: {
                    gte: new Date('2025-12-01'),
                    lte: new Date('2025-12-31')
                },
            }
            const orderBy = {
                name: 'asc'
            }
            const result = await userQueries.users(null, args, context);
            expect(result.length).toBe(1);
            expect(result.length).toBeLessThanOrEqual(10);
            expect(result).toMatchObject([
                {
                    id: 'cl0293h4r000008l17n9fclbB',
                    name: 'JANE SMITH',
                    email: 'jane.smith@example.com',
                    role: Role.CUSTOMER,
                    orders: []
                }
            ]);
            expect(context.prisma.user.findMany).toHaveBeenCalledWith({
                where,
                orderBy,
                take: 10,
                skip: 0,
                include: {
                    orders: {
                        include: {
                            items: {
                                include: { product: true }
                            }
                        }
                    }
                }
            });
        });
        it('should return a list of users when the admin is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'cl0293h4r000008l17n9fclbB',
                                name: 'JANE SMITH',
                                email: 'jane.smith@example.com',
                                role: Role.CUSTOMER,
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
            expect(result.length).toBeLessThan(10);
            expect(result.length).toBe(1);
            expect(result).toEqual([
                {
                    id: 'cl0293h4r000008l17n9fclbB',
                    name: 'JANE SMITH',
                    email: 'jane.smith@example.com',
                    role: 'CUSTOMER',
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
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findMany).not.toHaveBeenCalled();
            }

        });
    });
    describe('User Resolver Tests', () => {
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
                role: 'CUSTOMER'
            });
        });
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
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findUnique).not.toHaveBeenCalled();
            }
        });
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
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findUnique).not.toHaveBeenCalled();
            }
        });
    });
    describe('Customer Count Resolver Tests', () => {
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

    });
    describe('Users Count Resolver Tests', () => {
        it('should return the number of user accounts when admin is signed in', async () => {
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
            const result = await userQueries.usersCount(null, args, context);
            expect(result).toBe(6);
            expect(context.prisma.user.count).toHaveBeenCalledWith();
        })
        it('should throw an error when a customer tries to get the number of user accounts created', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        count: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000008l17n9fclba',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {};
            try {
                await userQueries.usersCount(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.count).not.toHaveBeenCalled();
            }
        })
        it('should throw an error when a guest tries to get the number of user accounts created with no session at all', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        count: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {};
            try {
                await userQueries.usersCount(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.count).not.toHaveBeenCalled();
            }
        })
    });

});