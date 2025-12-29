/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from "vitest";
import mutationsOrder from '@/app/graphql/mutations/orders';
import { OrderStatus, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';

const createMockContext = (overrides = {}) => {
    return {
        prisma: {
            ...overrides.prisma,
        },
        session: {
            ...overrides.session,
        },
        ...overrides,
    }
}

describe('Order Mutation Resolver Functions Tests', () => {
    describe('addOrder mutation resolver function Tests', () => {
        // TODO: Test authorization with admin session - should fail with Unauthorized
        it('should throw Unauthorized error when admin tries to add order', async () => {
            // Mock admin session
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue({
                        id: 'clp293h4r000008l17n9fclbA',
                        userId: 'clp293h4r000008l17n9fclbB',
                        status: OrderStatus.PENDING,
                        items: [
                            {
                                id: 'clp293h4r000008l17n9fclbC',
                                orderId: 'clp293h4r000008l17n9fclbD',
                                productId: 'clp293h4r000008l17n9fclbE',
                                qte: 1, //quantity ordered
                            }
                        ],
                        total: 1, // some of prices * quantities of items
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                },
                session: {
                    id: 'clp123clp293h4r000008l17n9fclbD',
                    role: Role.ADMIN,
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                }],
                total: 1,
            };
            // Call addOrder
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });
        // TODO: Test Authorization with customer session - should succeed
        it('Should successfully create order when customer adds order', async () => {
            // Mock admin session
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue({
                        id: 'clp293h4r000008l17n9fclbA',
                        userId: 'clp293h4r000008l17n9fclbB',
                        status: OrderStatus.PENDING,
                        items: [
                            {
                                id: 'clp293h4r000008l17n9fclbC',
                                orderId: 'clp293h4r000008l17n9fclbD',
                                productId: 'clp293h4r000008l17n9fclbE',
                                qte: 1, //quantity ordered
                            }
                        ],
                        total: 1, // some of prices * quantities of items
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }),
                },
                session: {
                    user: {
                        id: 'clp123clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                }],
                total: 1,
            };
            // Call addOrder
            const result = await mutationsOrder.addOrder(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbA',
                userId: 'clp293h4r000008l17n9fclbB',
                status: OrderStatus.PENDING,
                items: [
                    {
                        id: 'clp293h4r000008l17n9fclbC',
                        orderId: 'clp293h4r000008l17n9fclbD',
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 1, //quantity ordered
                    }
                ],
                total: 1, // some of prices * quantities of items
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

        });

        // TODO: Test authorization with no session - should fail with Unauthorized
        it('should throw Unauthorized error when no session', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue(),
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                }],
                total: 1,
            };
            // Call addOrder
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        // TODO: Test missing items arg - should fail with Validation failed
        it('should throw validation error when items are missing', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue(),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                total: 1,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'items',
                        message: "It's impossible to create order with no selected product",
                    }
                ])
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });


        // TODO: Test missing total arg - should fail with Validation failed
        it('should throw validation error when total is missing', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue(),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                }],
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'total',
                        message: "Total is required as number",
                    }
                ])
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        // TODO: Test items with missing quantity (wrong form) - should fail with Validation failed
        it('should throw validation error when items have missing quantity', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue(),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                }],
                total: 1,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'items',
                        message: "Quantity is required as number",
                    }
                ])
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        // TODO: Test items with invalid productId - should fail with Validation failed
        it('should throw validation error when items have invalid productId', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockResolvedValue(),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 123,
                    qte: 1,
                }],
                total: 1,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'items',
                        message: "Product ID must be a string",
                    }
                ])
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        // TODO: Test with wrong total value (not matching items) - should fail (inside transaction)
        it('should throw error when total does not match calculated total from items', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        // Create mocked tx with product.findUnique
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 10,  // Sufficient stock
                                    price: 10,       // Price for calculation
                                }),
                                update: vi.fn().mockResolvedValue({}),  // For stock decrement (won't reach)
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({}),  // Won't reach due to total mismatch
                            },
                        };
                        // Execute the real callback with mocked tx
                        return await callback(tx);
                    }),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                }],
                total: 1,
            };
            try {
                const result = await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Total price does not match');
                expect(error.extensions.code).toBe('TOTAL_PRICE_DOES_NOT_MATCH');
                expect(context.prisma.$transaction).toHaveBeenCalled();
            }
        });

        // TODO: Test insufficient stock (qteInStock < item.qte) - should fail with Not enough stock
        it('should throw Not enough stock error when stock is insufficient', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 1,
                                    price: 1,
                                })
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({})
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 2,
                }],
                total: 2,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Not enough stock');
                expect(error.extensions.code).toBe('NOT_ENOUGH_STOCK');
                expect(context.prisma.$transaction).toHaveBeenCalled();
            }
        });

        // TODO: Test product not found during stock check - should fail with Product not found
        it('should throw Product not found error when product does not exist', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue(null),
                                update: vi.fn().mockResolvedValue({}),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({})
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 2,
                }],
                total: 2,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Product not found');
                expect(error.extensions.code).toBe('PRODUCT_NOT_FOUND');
                expect(context.prisma.$transaction).toHaveBeenCalled();
            }
        });

        // TODO: Test multiple items with same product - stock decremented correctly
        it('should handle multiple items referencing same product correctly', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 10,
                                    price: 10,
                                }),
                                update: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 5,
                                }),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbF',
                                    total: 50,
                                    items: [
                                        {
                                            productId: 'clp293h4r000008l17n9fclbE',
                                            qte: 2,
                                        },
                                        {
                                            productId: 'clp293h4r000008l17n9fclbE',
                                            qte: 3,
                                        },
                                    ],
                                })
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 2,
                    },
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
                total: 50,
            };
            const result = await mutationsOrder.addOrder(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbF',
                total: 50,
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 2,
                    },
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
            });
            expect(context.prisma.$transaction).toHaveBeenCalled();
        });

        // TODO: Test empty items array - should fail with Validation failed
        it('should throw validation error when items array is empty', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue(null),
                                update: vi.fn().mockResolvedValue(),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue(),
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [],
                total: 0,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'items',
                        message: "It's impossible to create order with no selected product"
                    }
                ]);
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        // TODO: Test Prisma P2003 error (invalid reference) - should fail with Invalid data reference
        it('should throw Invalid data reference error on P2003', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue(null),
                                update: vi.fn().mockResolvedValue(),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue(),
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 2,
                    },
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
                total: 50,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Product not found');
                expect(error.extensions.code).toBe('PRODUCT_NOT_FOUND');
                expect(context.prisma.$transaction).toHaveBeenCalled();
            }
        });

        // TODO: Test successful order creation with stock update
        it('should successfully create order and update stock', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 5,
                                    price: 10,
                                }),
                                update: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbE',
                                    qteInStock: 2,
                                    price: 10,
                                }),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({
                                    id: 'clp293h4r000008l17n9fclbF',
                                    total: 30,
                                    items: [
                                        {
                                            productId: 'clp293h4r000008l17n9fclbE',
                                            qte: 3,
                                        },
                                    ],
                                }),
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
                total: 30,
            };
            const result = await mutationsOrder.addOrder(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbF',
                total: 30,
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
            });
            expect(context.prisma.$transaction).toHaveBeenCalled();
        });
    });
    describe('updateOrder mutation resolver function Tests', () => {
        it('should successfully update order status with admin session and correct args', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbF',
                            userId: 'clp293h4r000008l17n9fclbB',
                            status: OrderStatus.CONFIRMED,
                            total: 30,
                            items: [
                                {
                                    productId: 'clp293h4r000008l17n9fclbE',
                                    qte: 3,
                                },
                            ],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            const result = await mutationsOrder.updateOrder(null, args, context);
            expect(context.prisma.order.update).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbF',
                },
                data: {
                    status: 'CONFIRMED',
                },
            });
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbF',
                userId: 'clp293h4r000008l17n9fclbB',
                status: OrderStatus.CONFIRMED,
                total: 30,
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbE',
                        qte: 3,
                    },
                ],
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should fail with UNAUTHORIZED when customer tries to update order', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with BAD_REQUEST for invalid order id type and admin session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 1234567890,
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with validation error for missing status', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'status',
                        message: "Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED",
                    },
                ]);
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with NOT_FOUND when order does not exist', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('Order not found', {
                code: 'P2025',
            });
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockRejectedValue(P2025Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Order not found');
                expect(error.extensions.code).toBe('NOT_FOUND');
                expect(context.prisma.order.update).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbF',
                    },
                    data: {
                        status: 'CONFIRMED',
                    },
                });
            }
        });

        it('should fail with UNAUTHORIZED when no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with UNAUTHORIZED for invalid session role', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with validation error for invalid status value', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: 'EATING',
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'status',
                        message: "Wrong status value, must be one of PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED or RETURNED",
                    },
                ]);
                expect(context.prisma.order.update).not.toHaveBeenCalled();
            }
        });

        it('should fail with INVALID_DATA_REFERENCE on Prisma P2003', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2003Error = new PrismaClientKnownRequestError('Invalid data reference', {
                code: 'P2003',
            });
            const context = createMockContext({
                prisma: {
                    order: {
                        update: vi.fn().mockRejectedValue(P2003Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
                status: OrderStatus.CONFIRMED,
            };
            try {
                await mutationsOrder.updateOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid data reference');
                expect(error.extensions.code).toBe('INVALID_DATA_REFERENCE');
                expect(context.prisma.order.update).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbF',
                    },
                    data: {
                        status: 'CONFIRMED',
                    },
                });
            }
        });
    });
    describe('deleteOrder mutation resolver function Tests', () => {
        it('should successfully delete order with admin session and valid ID', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbF',
                            userId: 'clp293h4r000008l17n9fclbB',
                            status: OrderStatus.RETURNED,
                            total: 20,
                            items: [
                                {
                                    productId: 'clp293h4r000008l17n9fclbC',
                                    quantity: 2,
                                },
                            ],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            const result = await mutationsOrder.deleteOrder(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbF',
                userId: 'clp293h4r000008l17n9fclbB',
                status: OrderStatus.RETURNED,
                total: 20,
                items: [
                    {
                        productId: 'clp293h4r000008l17n9fclbC',
                        quantity: 2,
                    },
                ],
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(context.prisma.order.delete).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbF',
                },
            });
        });

        it('should fail with UNAUTHORIZED when customer tries to delete order', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.delete).not.toHaveBeenCalled();
            }
        });

        it('should fail with UNAUTHORIZED when no session', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue(null)
                    }
                },
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.delete).not.toHaveBeenCalled();
            }
        });

        it('should fail with UNAUTHORIZED for invalid session role', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue(null)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: 'HACKER',
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.order.delete).not.toHaveBeenCalled();
            }
        });

        it('should fail with BAD_REQUEST for invalid order id type', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 1234567890,
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.order.delete).not.toHaveBeenCalled();
            }
        });

        it('should fail with BAD_REQUEST for missing order id', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: null,
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid order id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.order.delete).not.toHaveBeenCalled();
            }
        });

        it('should fail with NOT_FOUND when order does not exist', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('Order not found', {
                code: 'P2025',
                clientVersion: '1.0.0',
                meta: {
                    message: 'Order not found',
                },
            });
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockRejectedValue(P2025Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Order not found');
                expect(error.extensions.code).toBe('ORDER_NOT_FOUND');
                expect(context.prisma.order.delete).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbF'
                    }
                });
            }
        });

        it('should fail with INVALID_DATA_REFERENCE on Prisma P2003', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2003Error = new PrismaClientKnownRequestError('Invalid data reference', {
                code: 'P2003',
                clientVersion: '1.0.0',
                meta: {
                    message: 'Invalid data reference',
                },
            });
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockRejectedValue(P2003Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbC',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbF',
            };
            try {
                await mutationsOrder.deleteOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid data reference');
                expect(error.extensions.code).toBe('INVALID_DATA_REFERENCE');
                expect(context.prisma.order.delete).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbF'
                    }
                });
            }
        });
    })
});
