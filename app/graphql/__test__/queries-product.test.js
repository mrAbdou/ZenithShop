/**
 * @vitest-environment node
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import productQueries from "../queries/products.js";
import { Role } from "@prisma/client";
import { graphql, GraphQLError } from "graphql";
const createMockContext = (overrides = {}) => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
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
                        })
                    }
                }
            });
            const result = await productQueries.product(null, { id: 'clp1234567890abcdefghij' }, context);
            expect(result).toMatchObject({
                id: 'clp1234567890abcdefghij',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                qteInStock: 10,
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
                            {
                                id: 'clp1234567890abcdefghij',
                                name: 'Product 2',
                                description: 'Description 2',
                                price: 200,
                                qteInStock: 20,
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 5,
                offset: 0,
            }
            const result = await productQueries.infiniteProducts(null, args, context);
            expect(result).toHaveLength(2);
            expect(result).toMatchObject([
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 100,
                    qteInStock: 10,
                },
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 2',
                    description: 'Description 2',
                    price: 200,
                    qteInStock: 20,
                }
            ]);
        });
        it('should return a list of products when trying to get list of products with limit and offset correctly set but with no authorization for admin', async () => {
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
                            {
                                id: 'clp1234567890abcdefghij',
                                name: 'Product 2',
                                description: 'Description 2',
                                price: 200,
                                qteInStock: 20,
                            }
                        ]),
                    }
                },
            });
            const args = {
                limit: 5,
                offset: 0,
            };
            const result = await productQueries.infiniteProducts(null, args, context);
            expect(result).toHaveLength(2);
            expect(result).toMatchObject([
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 100,
                    qteInStock: 10,
                },
                {
                    id: 'clp1234567890abcdefghij',
                    name: 'Product 2',
                    description: 'Description 2',
                    price: 200,
                    qteInStock: 20,
                }
            ]);
        });
        it('should throw an error when try to get list of products with string limit value, correct offset, and admin session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 'five',
                offset: 0,
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('Should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
            }
        });
        it('should throw an error when try to get list of products with string offset value, correct limit, and admin session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 5,
                offset: 'zero',
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('Should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be a number');
            }

        });
        it('should throw an error when try to get list of products with string limit value, correct offset, and no authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 'five',
                offset: 0,
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('Should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
            }

        });
        it('should throw an error when try to get list of products with string offset value, correct limit, and no authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 5,
                offset: 'zero',
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('Should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be a number');
            }

        });
        it('should throw an error when try to get list of products with string limit, string offset, and admin session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 'five',
                offset: 'zero',
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('Should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(2);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
                expect(error.extensions.errors[1].field).toBe('offset');
                expect(error.extensions.errors[1].message).toBe('Offset should be a number');
            }

        });
        it('should throw an error when try to get list of products with string limit, string offset, and no authorization for admin', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 'five',
                offset: 'zero',
            };
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(2);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
                expect(error.extensions.errors[1].field).toBe('offset');
                expect(error.extensions.errors[1].message).toBe('Offset should be a number');
            }

        });
        it('should throw an error when try to get list of products with only limit provided, and admin authorized', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                limit: 5,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be a number');
            }
        });
        it('should throw an error when try to get list of producrs with only offset provided, and admin authorized', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp1234567890abcdefghij',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
            }
        });
        it('should throw an error when try to get list of products with only limit provided, and no admin authorized', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
            });
            const args = {
                limit: 5,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be a number');
            }
        })
        it('should throw an error when try to get list of products with only offset provided, and no authorization for admin', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
            });
            const args = {
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
            }
        });
        it('should throw an error when try to get list of products with low limit value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 4,
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be at least 5');
            }
        });
        it('should throw an error when try to get list of products with high limit value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 21,
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be at most 20');
            }
        });
        it('should throw an error when try to get list of products with negative limit value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: -1,
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be at least 5');
            }
        });
        it('should throw an error when try to get list of products with negative offset value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 5,
                offset: -1,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be at least 0');
            }
        });
        it('should throw an error when try to get list of products with string numeric limit value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: '5',
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
            }
        });
        it('should throw an error when try to get list of products with string numeric offset value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                offset: '0',
                limit: 5,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be a number');
            }
        });
        it('should throw an error when try to get list of products with low offset value', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 5,
                offset: -1
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be at least 0');
            }
        })
        it('should throw an error when try to get list of products with decimal value in limit', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 5.5,
                offset: 0,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be an integer');
            }
        })
        it('should throw an error when try to get list of products with decimal value in offset', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                limit: 5,
                offset: 0.5,
            }
            try {
                await productQueries.infiniteProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('offset');
                expect(error.extensions.errors[0].message).toBe('Offset should be an integer');
            }
        })
    });
    describe('Pagination Products Tests', () => {
        it('should return the list of products without no filter no sorting, only valid pagination props with admin authorization', async () => {
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
                                category: 'Category 1',
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
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    price: 10,
                    description: 'Description 1',
                    image: 'image1.jpg',
                    category: 'Category 1',
                }
            ])
        });
        it('should return the list of products paginated and filtered with admin authorization', async () => {
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
                startDate: undefined,
                endDate: undefined,
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10,
                    qteInStock: 10,
                }
            ])
        });
        it('should return filtered products with pagination with admin authorization', async () => {
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
                startDate: undefined,
                endDate: undefined,
                limit: 5,
                currentPage: 1
            }
            const result = await productQueries.paginatedProducts(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10,
                    qteInStock: 10,
                }
            ]);
        })
        it('should return the list of products sorted, paginated and filtered with admin authorization', async () => {
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
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(result).toMatchObject([
                {
                    id: 'clpx1234gfrf890abcdefjhi',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10,
                    qteInStock: 10,
                }
            ])
        });
        it('should throw an error if you filter data without pagination with admin authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue(),
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
            };
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(2);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
                expect(error.extensions.errors[1].field).toBe('currentPage');
                expect(error.extensions.errors[1].message).toBe('Current page should be a number');
            }
        });
        it('should throw an error if you try to sort data without pagination props with admin authorization', async () => {
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
                sortBy: 'name',
                sortDirection: 'asc',
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(2);
                expect(error.extensions.errors[0].field).toBe('limit');
                expect(error.extensions.errors[0].message).toBe('Limit should be a number');
                expect(error.extensions.errors[1].field).toBe('currentPage');
                expect(error.extensions.errors[1].message).toBe('Current page should be a number');
            }
        });
        //with no authorization
        it('should throw an error when you try to get a list of products with no filter, no sorting, no authorization, only valid pagination props', async () => {
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
            }

        });
        it('should throw an error when you try to get a paginated and filtered list of products with no authorization', async () => {
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
            }
        });
        it('should throw an error when you try to get a paginated and filtered list of products with no authorization', async () => {
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
            }
        })
        it('should throw an error when you try to get a paginated and sorted list of products with no authorization', async () => {
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
            }
        });
        it('should throw an error if you filter data without pagination with no authorization', async () => {
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
            }
        });
        it('should throw an error if you try to sort data without pagination props with admin authorization', async () => {
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
            }
        });
        it('should return a list of products when searching in arabic', async () => {
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
            }
        });
        it('should return a list of products when searching in french', async () => {
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
            }
        });
        it('should throw an error when you filter on products with incorrect value of stock with admin authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
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
                stock: 'i think so',
                currentPage: 1,
                limit: 5
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('stock');
                expect(error.extensions.errors[0].message).toBe('Invalid option: expected one of ""|"In Stock"|"Low Stock"|"Out Stock"');
            }

        })
        it('should throw an error when you filter on products with incorrect value of stock with no authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                stock: 'i think so',
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
            }

        });
        it('should throw an error if you tried to filter using date range where the start is greater then the end date with admin authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
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
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('endDate');
                expect(error.extensions.errors[0].message).toBe('Invalid date range');
            }
        });
        it('should throw an error if you tried to filter using date range where the start is greater then the end date with no authorization', async () => {
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
            }
        });
        it('should throw an error if you try to sort products with only sort by with admin authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
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
                sortBy: 'createdAt',
                currentPage: 1,
                limit: 5
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('sortDirection');
                expect(error.extensions.errors[0].message).toBe('Invalid option: expected one of ""|"asc"|"desc"');
            }
        });
        it('should throw an error if you try to sort products with only sort by with no authorization', async () => {
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
            }
        });
        it('should throw an error if you try to sort products with only sort direction with admin authorization', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        findMany: vi.fn().mockResolvedValue()
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
                sortDirection: 'desc',
            }
            try {
                await productQueries.paginatedProducts(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                console.log(error.extensions);
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].field).toBe('sortBy');
                expect(error.extensions.errors[0].message).toBe('Invalid option: expected one of ""|"id"|"name"|"price"|"stock"|"createdAt"');
            }
        });
        it('should throw an error if you try to sort products with only sort direction with no authorization', async () => {
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
            }
        });
    })
});
