/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from "vitest";
import mutationsOrder from '@/app/graphql/mutations/orders';
import { OrderStatus, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';

const IDS = {
    // Ensuring all IDs satisfy the >= 24 character constraint (minProductIdLength)
    ADMIN: 'admin00000admin00000admin',
    CUSTOMER: 'customer00customer00cust',
    PRODUCT: 'product000product000prod',
    ORDER: 'order00000order00000order',
    ITEM: 'item000000item000000item0',
};

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

        it('should throw Unauthorized error when admin tries to add order', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn(),
                },
                session: {
                    id: IDS.ADMIN,
                    role: Role.ADMIN,
                }
            });
            const args = {
                items: [{ productId: IDS.PRODUCT, qte: 1 }],
                total: 1,
            };
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

        it('Should successfully create order when customer adds order', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            order: {
                                create: vi.fn().mockResolvedValue({
                                    id: IDS.ORDER,
                                    userId: IDS.CUSTOMER,
                                    status: OrderStatus.PENDING,
                                    items: [
                                        {
                                            id: IDS.ITEM,
                                            orderId: IDS.ORDER,
                                            productId: IDS.PRODUCT,
                                            qte: 1,
                                        }
                                    ],
                                    total: 10,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                }),
                            },
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    price: 10,
                                    qteInStock: 5,
                                }),
                                update: vi.fn().mockResolvedValue({
                                    id: IDS.PRODUCT,
                                    qteInStock: 4,
                                }),
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: {
                    user: {
                        id: IDS.CUSTOMER,
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {
                items: [{ productId: IDS.PRODUCT, qte: 1 }],
                total: 10,
            };
            const result = await mutationsOrder.addOrder(null, args, context);
            expect(result).toEqual({
                id: IDS.ORDER,
                userId: IDS.CUSTOMER,
                status: OrderStatus.PENDING,
                items: [
                    {
                        id: IDS.ITEM,
                        orderId: IDS.ORDER,
                        productId: IDS.PRODUCT,
                        qte: 1,
                    }
                ],
                total: 10,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should throw Unauthorized error when no session', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() }
            });
            const args = {
                items: [{ productId: IDS.PRODUCT, qte: 1 }],
                total: 1,
            };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        it('should throw validation error when items are missing', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { total: 1 };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        it('should throw validation error when total is missing', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: IDS.PRODUCT, qte: 1 }] };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        it('should throw validation error when items have missing quantity', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: IDS.PRODUCT }], total: 1 };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        it('should throw validation error when items have invalid productId', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: 123, qte: 1 }], total: 1 };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(context.prisma.$transaction).not.toHaveBeenCalled();
            }
        });

        it('should throw error when total does not match calculated total from items', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: IDS.PRODUCT,
                                    qteInStock: 10,
                                    price: 10,
                                }),
                                update: vi.fn(),
                            },
                        };
                        return await callback(tx);
                    }),
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: IDS.PRODUCT, qte: 1 }], total: 1 }; // 1 != 10
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Total price does not match');
                expect(error.extensions.code).toBe('TOTAL_PRICE_DOES_NOT_MATCH');
                expect(context.prisma.$transaction).toHaveBeenCalled();
            }
        });

        it('should throw Not enough stock error when stock is insufficient', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: IDS.PRODUCT,
                                    qteInStock: 1,
                                    price: 10,
                                })
                            },
                        }
                        return await callback(tx);
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: IDS.PRODUCT, qte: 2 }], total: 20 };
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

        it('should throw Product not found error when product does not exist', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: { findUnique: vi.fn().mockResolvedValue(null) },
                        }
                        return await callback(tx);
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [{ productId: IDS.PRODUCT, qte: 1 }], total: 10 };
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

        it('should handle multiple items referencing same product correctly', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: IDS.PRODUCT,
                                    qteInStock: 10,
                                    price: 10,
                                }),
                                update: vi.fn().mockResolvedValue({ id: IDS.PRODUCT, qteInStock: 5 }),
                            },
                            order: {
                                create: vi.fn().mockResolvedValue({
                                    id: IDS.ORDER,
                                    total: 50,
                                    items: [
                                        { productId: IDS.PRODUCT, qte: 2 },
                                        { productId: IDS.PRODUCT, qte: 3 },
                                    ],
                                })
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = {
                items: [
                    { productId: IDS.PRODUCT, qte: 2 },
                    { productId: IDS.PRODUCT, qte: 3 },
                ],
                total: 50,
            };
            const result = await mutationsOrder.addOrder(null, args, context);
            expect(result.id).toBe(IDS.ORDER);
            expect(context.prisma.$transaction).toHaveBeenCalled();
        });

        it('should throw validation error when items array is empty', async () => {
            const context = createMockContext({
                prisma: { $transaction: vi.fn() },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            const args = { items: [], total: 0 };
            try {
                await mutationsOrder.addOrder(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
            }
        });

        it('should throw Invalid data reference error on P2003', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            product: { findUnique: vi.fn().mockResolvedValue(null) },
                            order: {
                                create: vi.fn().mockRejectedValue({ code: 'P2003' })
                            }
                        }
                        return await callback(tx);
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
        });
    });

    describe('updateOrder mutation resolver function Tests', () => {
        it('should successfully update order status with admin session and correct args', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (callback) => {
                        const tx = {
                            order: {
                                findUnique: vi.fn().mockResolvedValue({
                                    id: IDS.ORDER,
                                    status: OrderStatus.PENDING,
                                    items: [{ productId: IDS.PRODUCT, qte: 3 }]
                                }),
                                update: vi.fn().mockResolvedValue({
                                    id: IDS.ORDER,
                                    userId: IDS.CUSTOMER,
                                    status: OrderStatus.CONFIRMED,
                                    total: 30,
                                    items: [{ productId: IDS.PRODUCT, qte: 3 }],
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                })
                            }
                        };
                        return await callback(tx);
                    })
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            const args = { id: IDS.ORDER, status: OrderStatus.CONFIRMED };
            const result = await mutationsOrder.updateOrder(null, args, context);
            expect(context.prisma.$transaction).toHaveBeenCalled();
            expect(result.status).toBe(OrderStatus.CONFIRMED);
        });

        it('should fail with UNAUTHORIZED when customer tries to update order', async () => {
            const context = createMockContext({
                prisma: { order: { update: vi.fn() } },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            try {
                await mutationsOrder.updateOrder(null, { id: IDS.ORDER, status: OrderStatus.CONFIRMED }, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });

        it('should fail with BAD_REQUEST for invalid order id type', async () => {
            const context = createMockContext({
                prisma: { order: { update: vi.fn() } },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            try {
                await mutationsOrder.updateOrder(null, { id: 123, status: 'CONFIRMED' }, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('BAD_REQUEST');
            }
        });

        it('should fail with NOT_FOUND when order does not exist', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (cb) => {
                        return await cb({
                            order: { findUnique: vi.fn().mockResolvedValue(null) }
                        });
                    })
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            try {
                await mutationsOrder.updateOrder(null, { id: IDS.ORDER, status: OrderStatus.CONFIRMED }, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('NOT_FOUND');
            }
        });

        it('should succeed with first-time cancel status change and update stock', async () => {
            const txProductUpdate = vi.fn().mockResolvedValue({});
            const txOrderUpdate = vi.fn().mockResolvedValue({ id: IDS.ORDER, status: OrderStatus.CANCELLED });
            const txOrderFind = vi.fn().mockResolvedValue({
                id: IDS.ORDER,
                status: OrderStatus.PENDING,
                items: [{ productId: IDS.PRODUCT, qte: 5 }]
            });

            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (cb) => {
                        return await cb({
                            order: { findUnique: txOrderFind, update: txOrderUpdate },
                            product: { update: txProductUpdate }
                        });
                    })
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });

            await mutationsOrder.updateOrder(null, { id: IDS.ORDER, status: OrderStatus.CANCELLED }, context);

            expect(txProductUpdate).toHaveBeenCalledWith({
                where: { id: IDS.PRODUCT },
                data: { qteInStock: { increment: 5 } }
            });
        });

        it('should return same order on second-time cancel status change without updating stock', async () => {
            const txProductUpdate = vi.fn();
            const txOrderUpdate = vi.fn();
            const txOrderFind = vi.fn().mockResolvedValue({
                id: IDS.ORDER,
                status: OrderStatus.CANCELLED,
                items: [{ productId: IDS.PRODUCT, qte: 5 }],
                total: 100
            });

            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (cb) => {
                        return await cb({
                            order: { findUnique: txOrderFind, update: txOrderUpdate },
                            product: { update: txProductUpdate }
                        });
                    })
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });

            const result = await mutationsOrder.updateOrder(null, { id: IDS.ORDER, status: OrderStatus.CANCELLED }, context);

            expect(txProductUpdate).not.toHaveBeenCalled();
            expect(txOrderUpdate).not.toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({ status: OrderStatus.CANCELLED }));
        });
    });

    describe('cancelOrder mutation resolver function Tests', () => {
        it('should successfully cancel order and update stock', async () => {
            const txProductUpdate = vi.fn().mockResolvedValue({});
            const txOrderUpdate = vi.fn();
            const txOrderFind = vi.fn().mockResolvedValue({
                id: IDS.ORDER,
                items: [{ productId: IDS.PRODUCT, qte: 2 }]
            });

            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (cb) => {
                        return await cb({
                            order: {
                                findUnique: txOrderFind,
                                update: txOrderUpdate
                            },
                            product: { update: txProductUpdate }
                        });
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });

            const args = { id: IDS.ORDER };
            await mutationsOrder.cancelOrder(null, args, context);

            expect(txProductUpdate).toHaveBeenCalledWith({
                where: { id: IDS.PRODUCT },
                data: { qteInStock: { increment: 2 } }
            });
            expect(txOrderUpdate).toHaveBeenCalledWith({
                where: { id: IDS.ORDER },
                data: { status: OrderStatus.CANCELLED }
            });
        });

        it('should throw ORDER_NOT_FOUND if order is not pending/confirmed or does not belong to user', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation(async (cb) => {
                        const tx = { order: { findUnique: vi.fn().mockResolvedValue(null) } };
                        return await cb(tx);
                    })
                },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            try {
                await mutationsOrder.cancelOrder(null, { id: IDS.ORDER }, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('ORDER_NOT_FOUND');
            }
        });
    });

    describe('deleteOrder mutation resolver function Tests', () => {
        it('should successfully delete order with admin session and valid ID', async () => {
            const context = createMockContext({
                prisma: {
                    order: {
                        delete: vi.fn().mockResolvedValue({
                            id: IDS.ORDER,
                            status: OrderStatus.RETURNED,
                        })
                    }
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            const args = { id: IDS.ORDER };
            const result = await mutationsOrder.deleteOrder(null, args, context);
            expect(result.id).toBe(IDS.ORDER);
            expect(context.prisma.order.delete).toHaveBeenCalledWith({ where: { id: IDS.ORDER } });
        });

        it('should fail with UNAUTHORIZED when customer tries to delete order', async () => {
            const context = createMockContext({
                prisma: { order: { delete: vi.fn() } },
                session: { user: { id: IDS.CUSTOMER, role: Role.CUSTOMER } }
            });
            try {
                await mutationsOrder.deleteOrder(null, { id: IDS.ORDER }, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        });

        it('should fail with NOT_FOUND when order does not exist', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('Order not found', { code: 'P2025', clientVersion: '1.0.0' });

            const context = createMockContext({
                prisma: {
                    order: { delete: vi.fn().mockRejectedValue(P2025Error) }
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            try {
                await mutationsOrder.deleteOrder(null, { id: IDS.ORDER }, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('ORDER_NOT_FOUND');
            }
        });

        it('should fail with INVALID_DATA_REFERENCE on Prisma P2003', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2003Error = new PrismaClientKnownRequestError('Invalid data reference', { code: 'P2003' });

            const context = createMockContext({
                prisma: {
                    order: { delete: vi.fn().mockRejectedValue(P2003Error) }
                },
                session: { user: { id: IDS.ADMIN, role: Role.ADMIN } }
            });
            try {
                await mutationsOrder.deleteOrder(null, { id: IDS.ORDER }, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.extensions.code).toBe('INVALID_DATA_REFERENCE');
            }
        });
    });
});
