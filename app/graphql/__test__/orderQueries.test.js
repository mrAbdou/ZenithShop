import { OrderStatus, Role } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import orderQueries from "@/app/graphql/queries/orders";
import { GraphQLError } from "graphql";
const createMockContext = (overrides = {}) => ({
    prisma: {
        order: {
            ...overrides.order
        }
    },
    ...overrides.session,
    ...overrides
})
describe("orderQueries", () => {
    describe("myOrders Query Resolver Tests", () => {
        it('should return a list of orders for the signed in customer', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {};
            const result = await orderQueries.myOrders(null, args, context);
        });
        it('should throw an error when signed in admin try to call for myOrders', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {};
            try {
                await orderQueries.myOrders(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
            }
        });
        it('should throw an error when you try to call myOrders with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
            });
            const args = {};
            try {
                await orderQueries.myOrders(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        })
    });

    describe('orders Query Resolver Tests', () => {
        it('should return a list of filtered orders for admin when status is provided', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                status: OrderStatus.PENDING,
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    status: {
                        equals: 'PENDING'
                    }
                },
                orderBy: {},
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
            expect(result).toMatchObject([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        })
        it('should return a list of orders for the admin when a start and end dates are provided', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    createdAt: {
                        gte: new Date('2024-01-01'),
                        lte: new Date('2024-12-31')
                    }
                },
                orderBy: {},
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
        })
        it('should return a list of sorted orders for the admin when both sort by and sort direction are provided', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                sortDirection: 'desc',
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
        });
        it('should return sorted orders when sortBy includes dot notation', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                sortBy: 'user.name',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { user: { name: 'asc' } },
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
            expect(result).toMatchObject([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        })
        it('should return filtered and paginated orders', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { id: { contains: 'test', mode: 'insensitive' } },
                        { user: { name: { contains: 'test', mode: 'insensitive' } } },
                    ],
                    status: { equals: 'PENDING' }
                },
                orderBy: {},
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
            expect(result).toMatchObject([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        })
        it('should return empty array when no orders match filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(0);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { id: { contains: 'test', mode: 'insensitive' } },
                        { user: { name: { contains: 'test', mode: 'insensitive' } } },
                    ],
                    status: { equals: 'PENDING' }
                },
                orderBy: {},
                skip: 0,
                take: 10,
                include: { user: true, items: true },
            });
            expect(result).toEqual([]);
        })
        it('should return a list of orders for the admin with pagination, sort and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { id: { contains: 'test', mode: 'insensitive' } },
                        { user: { name: { contains: 'test', mode: 'insensitive' } } }
                    ],
                    status: { equals: OrderStatus.PENDING },
                    createdAt: {
                        gte: new Date('2022-01-01'),
                        lte: new Date('2022-01-02')
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                },
                skip: 0,
                take: 10,
                include: {
                    user: true,
                    items: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        });
        it('should return a list of orders for the admin with pagination, sort', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: {
                    createdAt: 'asc'
                },
                skip: 0,
                take: 10,
                include: {
                    user: true,
                    items: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);

        });
        it('should return a list of orders for the admin with pagination and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { id: { contains: 'test', mode: 'insensitive' } },
                        { user: { name: { contains: 'test', mode: 'insensitive' } } }
                    ],
                    status: { equals: OrderStatus.PENDING },
                    createdAt: {
                        gte: new Date('2022-01-01'),
                        lte: new Date('2022-01-02')
                    }
                },
                orderBy: {},
                skip: 0,
                take: 10,
                include: {
                    user: true,
                    items: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        });
        it('should return a list of orders for the admin with only pagination', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                currentPage: 1,
                limit: 10
            };
            const result = await orderQueries.orders(null, args, context);
            expect(result.length).toBe(1);
            expect(context.prisma.order.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: {},
                skip: 0,
                take: 10,
                include: {
                    user: true,
                    items: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbA',
                    userId: 'clp293h4r000008l17n9fclbB',
                    status: OrderStatus.PENDING,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    items: []
                }
            ]);
        });
        it('should throw an error when admin tried to get a list of orders with sort and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                sortBy: 'createdAt',
                sortDirection: 'asc',
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('VALIDATION_FAILED');
                expect(error.extensions.errors.length).toBe(1);
                expect(error.extensions.errors[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
            }

        });
        it('should throw an error when admin tried to get a list of orders with sort', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                sortDirection: 'asc',
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('VALIDATION_FAILED');
                expect(error.extensions.errors.length).toBe(1);
                expect(error.extensions.errors[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
            }

        });
        it('should throw an error when admin tried to get a list of orders with no args', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {};
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('VALIDATION_FAILED');
                expect(error.extensions.errors.length).toBe(1);
                expect(error.extensions.errors[0].message).toBe('Both current page and limit must be provided together when filtering or sorting');
            }

        });
        //no admin
        it('should throw an error when no admin tried to get a list of orders with pagination, sort and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });
        it('should throw an error when no admin tried to get a list of orders with pagination, sort', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbA',
                                userId: 'clp293h4r000008l17n9fclbB',
                                status: OrderStatus.PENDING,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                items: []
                            }
                        ])
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                sortDirection: 'asc',
                currentPage: 1,
                limit: 10
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
        it('should throw an error when no admin tried to get a list of orders with pagination and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                currentPage: 1,
                limit: 10
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
        it('should throw an error when non signed in user tried to get a list of orders with only pagination', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                currentPage: 1,
                limit: 10
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
        it('should throw an error when none signed in user tried to get a list of orders with sort and filters', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                searchQuery: 'test',
                status: OrderStatus.PENDING,
                startDate: new Date('2022-01-01'),
                endDate: new Date('2022-01-02'),
                sortBy: 'createdAt',
                sortDirection: 'asc',
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
        it('should throw an error when none signed in user tried to get a list of orders with sort', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                sortDirection: 'asc',
            };
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
        it('should throw an error when none signed in user tried to get a list of orders with no args', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {};
            try {
                await orderQueries.orders(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }

        });
    });

    describe('order Query Resolver Tests', () => {
        it('should return an order when a valid string id is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbA',
                            userId: 'clp293h4r000008l17n9fclbB',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            status: OrderStatus.PENDING,
                            totalAmount: 100,
                            items: []
                        })
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbA'
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        })
        it('should throw an error when invalid id type (integer) is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                }
            });
            const args = {
                id: 123
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        })
        it('should throw an error when invalid id type (integer) is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: 123
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_USER_INPUT');
            }
        })
        it('should throw an error when invalid id type (null) is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: null
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_USER_INPUT');
            }
        })
        it('should throw an error when invalid id type (undefined) is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                }
            });
            const args = {
                id: undefined
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        })
        it('should throw an error when invalid id type (undefined) is provided with no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: undefined
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_USER_INPUT');
            }
        })
        it('should throw an error when order not found', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbA'
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Order not found');
                expect(error.extensions.code).toBe('NOT_FOUND');
            }
        })
        // TODO: Add it test for valid id, customer owns order - mock customer session, valid id string, order.userId matches session.user.id, expect order object with includes.
        it('should return an order when a valid string id is provided with customer session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbA',
                            userId: 'clp293h4r000008l17n9fclbB',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            status: 'PENDING',
                            total: 100,
                            items: []
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbA'
            };
            const result = await orderQueries.order(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbA',
                userId: 'clp293h4r000008l17n9fclbB',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                status: 'PENDING',
                total: 100,
                items: []
            });
        })
        // TODO: Add it test for valid id, admin access - mock admin session, valid id string, expect order object with includes.
        it('should return an order when a valid string id is provided with admin session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbA',
                            userId: 'clp293h4r000008l17n9fclbB',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            status: 'PENDING',
                            total: 100,
                            items: []
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbA'
            };
            const result = await orderQueries.order(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbA',
                userId: 'clp293h4r000008l17n9fclbB',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                status: 'PENDING',
                total: 100,
                items: []
            });
        })
        it('should throw an error when customer accessing other order', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbA',
                            userId: 'clp293h4r000008l17n9fclbZ',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            status: 'PENDING',
                            total: 100,
                            items: []
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbA'
            };
            try {
                await orderQueries.order(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Access denied: You can only view your own orders');
                expect(error.extensions.code).toBe('FORBIDDEN');
            }
        })
    });

    describe('ordersCount Query Resolver function', () => {
        it('should return the count of orders when admin session is available', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        count: vi.fn().mockResolvedValue(10)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {};
            const result = await orderQueries.ordersCount(null, args, context);
            expect(result).toBe(10);
            expect(context.prisma.order.count).toHaveBeenCalledWith();
        });
        it('should throw an error when customer session is available', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        count: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {};
            try {
                await orderQueries.ordersCount(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });
        it('should throw an error when no session is available', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        count: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {};
            try {
                await orderQueries.ordersCount(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });
    })
});
