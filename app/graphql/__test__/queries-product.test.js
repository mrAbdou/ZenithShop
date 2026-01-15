/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from "vitest";
import productQueries from "../queries/products.js";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";
const createMockContext = (overrides = {}) => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
        },
        ...overrides.prisma,
        session: {
            user: {
                role: Role.ADMIN
            }
        },
        ...overrides.session
    },
    ...overrides
});
describe('Product Queries', () => {
    it('productsCount should return the total number of products', async () => {
        const context = createMockContext({
            prisma: {
                product: {
                    count: vi.fn().mockResolvedValue(10)
                }
            }
        });
        const result = await productQueries.productsCount(null, {}, context);
        expect(context.prisma.product.count).toHaveBeenCalledWith();
        expect(result).toBe(10);
    });
    it('availableProductsCount should return the total number of the available products', async () => {
        const context = createMockContext({
            prisma: {
                product: {
                    count: vi.fn().mockResolvedValue(7)
                }
            }
        });
        const result = await productQueries.availableProductsCount(null, {}, context);
        expect(context.prisma.product.count).toHaveBeenCalledWith({ where: { qteInStock: { gt: 0 } } });
        expect(result).toBe(7);
    });
    describe('product Resolver Tests', () => {
        it('should return a product when id is valid', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp1234567890abcdefghij',
                            name: 'Product 1',
                            description: 'Description 1',
                            price: 100,
                            qteInStock: 10,
                            category: {
                                id: 'cat1',
                                name: 'Category 1'
                            },
                            orderItems: [
                                {
                                    id: 'orderItem1',
                                    order: {
                                        id: 'order1',
                                        user: {
                                            id: 'user1',
                                            name: 'User 1'
                                        }
                                    }
                                }
                            ]
                        })
                    }
                }
            });
            const args = { id: 'clp1234567890abcdefghij' }
            const result = await productQueries.product(null, args, context);
            expect(context.prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 'clp1234567890abcdefghij' }, include: { orderItems: { include: { order: { include: { user: true } } } }, category: true } });
            expect(result).toMatchObject({
                id: 'clp1234567890abcdefghij',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                qteInStock: 10,
                category: {
                    id: 'cat1',
                    name: 'Category 1'
                },
                orderItems: [
                    {
                        id: 'orderItem1',
                        order: {
                            id: 'order1',
                            user: {
                                id: 'user1',
                                name: 'User 1'
                            }
                        }
                    }
                ]
            });
        });
        it('should throw an error when id is integer', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findUnique: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                id: 1,
            };
            try {
                await productQueries.product(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.message).toBe('Invalid product id');
            }
        })
        it('should return null when id is not found', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                }
            });
            const args = {
                id: 'clb3234567890abcdefghij'
            };
            const result = await productQueries.product(null, args, context);
            expect(result).toBeNull();
        })
        it('should throw an error when id is not provided', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findUnique: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {}
            try {
                await productQueries.product(null, args, context)
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.message).toBe('Invalid product id');
            }
        })

    });
    describe('Infinite Products Tests', () => {
        it('should return list of products when limit and offset are correctly provided with the signed up user session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp1234567890abcdefghij',
                                name: 'Product 1',
                                description: 'Description 1',
                                price: 100,
                                qteInStock: 10,
                            },
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                limit: 5,
                offset: 0,
            }
            const result = await productQueries.infiniteProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: {},
                include: {
                    category: true,
                },
                take: 5,
                skip: 0,
            })
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 100,
                    qteInStock: 10,
                },
            ]);
        });
        it('should return a list of products when trying to get it with limit and offset correctly set but with no authorization for admin', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp1234567890abcdefghij',
                                name: 'Product 1',
                                description: 'Description 1',
                                price: 100,
                                qteInStock: 10,
                            },
                        ]),
                    }
                },
            });
            const args = {
                limit: 5,
                offset: 0,
            };
            const result = await productQueries.infiniteProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: {},
                include: {
                    category: true,
                },
                take: 5,
                skip: 0
            });
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 100,
                    qteInStock: 10,
                },
            ]);
        });
    });
    describe('Pagination Products Tests', () => {
        it('should return paginated products list when admin provides only pagination parameters', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'Product 1',
                                price: 10,
                                description: 'Description 1',
                                image: 'image1.jpg',
                                category: {
                                    id: 'cat1',
                                    name: 'Category 1'
                                },
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clpx1234567890abcdefjhi',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 5,
                currentPage: 1,
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: {},
                take: 5,
                skip: 0,
                include: {
                    category: true
                }
            });
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    price: 10,
                    description: 'Description 1',
                    image: 'image1.jpg',
                    category: {
                        id: 'cat1',
                        name: 'Category 1'
                    },
                }
            ])
        });
        it('should return products filtered by "Out Stock" status when admin provides search and stock filters', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'Product 1',
                                description: 'Description 1',
                                price: 10,
                                qteInStock: 10,
                                category: {
                                    id: 'cat1',
                                    name: 'Category 1'
                                },
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clpx1234567890abcdefjhi',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'Product 1',
                stock: 'Out Stock',
                startDate: undefined,
                endDate: undefined,
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {
                            id: {
                                contains: 'Product 1',
                                mode: 'insensitive'
                            }
                        },
                        {
                            name: {
                                contains: 'Product 1',
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: 'Product 1',
                                mode: 'insensitive'
                            }
                        }
                    ],
                    qteInStock: {
                        equals: 0
                    }
                },
                orderBy: {},
                take: 5,
                skip: 0,
                include: {
                    category: true
                }
            });
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10,
                    qteInStock: 10,
                    category: {
                        id: 'cat1',
                        name: 'Category 1'
                    },
                }
            ])
        });
        it('should return products sorted by name with "In Stock" filter and date range when admin provides all parameters', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'Product 1',
                                description: 'Description 1',
                                price: 10,
                                qteInStock: 10,
                                category: {
                                    id: 'cat1',
                                    name: 'Category 1'
                                },
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clpx1234567890abcdefjhi',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'Product 1',
                stock: 'In Stock',
                startDate: '2022-01-01',
                endDate: '2022-12-31',
                sortBy: 'name',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {
                            id: {
                                contains: 'Product 1',
                                mode: 'insensitive',
                            }
                        },
                        {
                            name: {
                                contains: 'Product 1',
                                mode: 'insensitive',
                            }
                        },
                        {
                            description: {
                                contains: 'Product 1',
                                mode: 'insensitive',
                            }
                        },
                    ],
                    qteInStock: {
                        gt: 10,
                    },
                    createdAt: {
                        gte: new Date('2022-01-01'),
                        lte: new Date('2022-12-31'),
                    }
                },
                orderBy: {
                    name: 'asc'
                },
                include: {
                    category: true
                },
                take: 5,
                skip: 0,
            });
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10,
                    qteInStock: 10,
                    category: {
                        id: 'cat1',
                        name: 'Category 1'
                    },
                }
            ])
        });

        it('should reject access when unauthenticated user requests basic pagination', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                limit: 5,
                currentPage: 1,
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }

        });
        it('should reject access when unauthenticated user requests filtered pagination', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                searchQuery: 'Product 1',
                stock: 'In Stock',
                startDate: undefined,
                endDate: undefined,
                limit: 5,
                currentPage: 1
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should reject access when unauthenticated user requests sorted pagination', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                searchQuery: 'Product 1',
                stock: 'In Stock',
                startDate: '2022-01-01',
                endDate: '2022-12-31',
                sortBy: 'name',
                sortDirection: 'asc',
                limit: 5,
                currentPage: 1
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should reject access when unauthenticated user requests filters without pagination', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                },
            });
            const args = {
                searchQuery: 'Product 1',
                stock: 'In Stock',
                startDate: '2022-01-01',
                endDate: '2022-12-31',
            };
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should reject access when admin provides sorting without pagination parameters', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                sortBy: 'name',
                sortDirection: 'asc',
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should return products when admin searches using Arabic text', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'منتج 1',
                                description: 'وصف 1',
                                price: 10,
                                qteInStock: 10,
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clpx1234567890abcdefjhi',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'منتج 1',
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(context.prisma.product.findMany).toBeCalledWith({
                where: {
                    OR: [
                        {
                            id: {
                                contains: 'منتج 1',
                                mode: 'insensitive'
                            }
                        },
                        {
                            name: {
                                contains: 'منتج 1',
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: 'منتج 1',
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                include: {
                    category: true,
                },
                orderBy: {},
                take: 5,
                skip: 0
            })
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'منتج 1',
                    description: 'وصف 1',
                    price: 10,
                    qteInStock: 10,
                }
            ])
        });
        it('should throw an error when searching in arabic with no authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'منتج 1',
                                description: 'وصف 1',
                                price: 10,
                                qteInStock: 10,
                            }
                        ])
                    }
                }
            });
            const args = {
                searchQuery: 'منتج 1',
                limit: 5,
                currentPage: 1
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });
        it('should return products when admin searches using French text', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'rouge a lèvre',
                                description: 'pour faire plaisir a votre femme',
                                price: 10,
                                qteInStock: 10,
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clpx1234567890abcdefjhi',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                searchQuery: 'pour faire plaisir a votre femme',
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(context.prisma.product.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        {
                            id: {
                                contains: 'pour faire plaisir a votre femme',
                                mode: 'insensitive'
                            }
                        },
                        {
                            name: {
                                contains: 'pour faire plaisir a votre femme',
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: 'pour faire plaisir a votre femme',
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                include: {
                    category: true
                },
                orderBy: {},
                take: 5,
                skip: 0
            });
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'rouge a lèvre',
                    description: 'pour faire plaisir a votre femme',
                    price: 10,
                    qteInStock: 10,
                }
            ])
        });
        it('should throw an error when searching in french with no authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clpx1234gfrf890abcdefjhi',
                                name: 'rouge a lèvre',
                                description: 'pour faire plaisir a votre femme',
                                price: 10,
                                qteInStock: 10,
                            }
                        ])
                    }
                }
            });
            const args = {
                searchQuery: 'pour faire plaisir a votre femme',
                limit: 5,
                currentPage: 1
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should reject access when unauthenticated user provides invalid date range', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                startDate: '2025-12-23',
                endDate: '2025-12-22',
                currentPage: 1,
                limit: 5
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

        it('should reject access when unauthenticated user provides only sortBy parameter', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                sortBy: 'createdAt',
                currentPage: 1,
                limit: 5
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled()
            }
        });

        it('should reject access when unauthenticated user provides only sortDirection parameter', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                sortDirection: 'desc',
                currentPage: 1,
                limit: 5
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized access');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.findMany).not.toHaveBeenCalled();
            }
        });

    })
});
