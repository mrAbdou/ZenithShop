import { describe, it, expect, vi } from "vitest";
import orderItems from "@/app/graphql/queries/orderItems";
import { GraphQLError } from "graphql";
import { Role } from "@prisma/client";

const createMockContext = (overrides = {}) => ({
    prisma: {
        orderItem: {
            ...overrides.orderItem
        }
    },
    ...overrides.session,
    ...overrides
});

describe("orderItems", () => {
    describe('orderItems Query Resolver function', () => {
        it('should return a list of order items when order id is correctly provided and with an admin session established', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbC',
                                orderId: 'clp293h4r000008l17n9fclbA',
                                productId: 'clp293h4r000008l17n9fclbE',
                                qte: 1,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                orderId: 'clp293h4r000008l17n9fclbA'
            };
            const result = await orderItems.orderItems(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(context.prisma.orderItem.findMany).toHaveBeenCalledWith({
                where: {
                    orderId: 'clp293h4r000008l17n9fclbA'
                },
                include: {
                    order: true,
                    product: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbC',
                    orderId: 'clp293h4r000008l17n9fclbA',
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            ]);
        })
        it('should return a list of order items when a signed in customer requests for their own order items', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'clp293h4r000008l17n9fclbC',
                                orderId: 'clp293h4r000008l17n9fclbA',
                                productId: 'clp293h4r000008l17n9fclbE',
                                qte: 1,
                                createdAt: new Date(),
                                updatedAt: new Date()
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
            const args = {
                orderId: 'clp293h4r000008l17n9fclbA'
            };
            const where = {
                orderId: 'clp293h4r000008l17n9fclbA',
                order: {
                    userId: 'clp293h4r000008l17n9fclbB'
                }
            };
            const result = await orderItems.orderItems(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            expect(context.prisma.orderItem.findMany).toHaveBeenCalledWith({
                where,
                include: {
                    order: true,
                    product: true
                }
            });
            expect(result).toEqual([
                {
                    id: 'clp293h4r000008l17n9fclbC',
                    orderId: 'clp293h4r000008l17n9fclbA',
                    productId: 'clp293h4r000008l17n9fclbE',
                    qte: 1,
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            ]);
        });
        it('should return an empty array when a signed in customer requests for unowned order items', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                orderId: 'clp293h4r000008l17n9fclbA'
            };
            const where = {
                orderId: 'clp293h4r000008l17n9fclbA',
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            const result = await orderItems.orderItems(null, args, context);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(0);
            expect(context.prisma.orderItem.findMany).toHaveBeenCalledWith({
                where,
                include: {
                    order: true,
                    product: true
                }
            });
            expect(result).toEqual([]);
        });
        it('should throw GraphQLError("Invalid order id") when orderId is null', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                orderId: null
            };
            const where = {
                orderId: null,
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            try {
                await orderItems.orderItems(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Invalid order id");
                expect(error.extensions.code).toBe("BAD_USER_INPUT");
            }
            expect(context.prisma.orderItem.findMany).not.toHaveBeenCalledWith();
        });
        it('should throw GraphQLError("Invalid order id") when orderId is undefined', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                orderId: undefined
            };
            const where = {
                orderId: undefined,
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            try {
                await orderItems.orderItems(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Invalid order id");
                expect(error.extensions.code).toBe("BAD_USER_INPUT");
            }
            expect(context.prisma.orderItem.findMany).not.toHaveBeenCalledWith();
        });
        it('should throw GraphQLError("Invalid order id") when orderId is empty string', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                orderId: ''
            };
            const where = {
                orderId: '',
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            try {
                await orderItems.orderItems(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Invalid order id");
                expect(error.extensions.code).toBe("BAD_USER_INPUT");
            }
            expect(context.prisma.orderItem.findMany).not.toHaveBeenCalledWith();
        });
        it('should throw GraphQLError("Invalid order id") when orderId is non-string (123)', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                orderId: 123
            };
            const where = {
                orderId: 123,
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            try {
                await orderItems.orderItems(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Invalid order id");
                expect(error.extensions.code).toBe("BAD_USER_INPUT");
            }
            expect(context.prisma.orderItem.findMany).not.toHaveBeenCalledWith();
        });
        it('should throw GraphQLError("Unauthorized") when no session is established', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findMany: vi.fn().mockResolvedValue([])
                    }
                }
            });
            const args = {
                orderId: 'clp293h4r000008l17n9fclbA'
            };
            const where = {
                orderId: 'clp293h4r000008l17n9fclbA',
                order: {
                    userId: 'clp293h4r000008l17n9fclbZ'
                }
            };
            try {
                await orderItems.orderItems(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Unauthorized");
                expect(error.extensions.code).toBe("UNAUTHORIZED");
            }
            expect(context.prisma.orderItem.findMany).not.toHaveBeenCalledWith();
        });
    });

    describe('orderItem Query Resolver function', () => {
        it('should return orderItem when admin session with valid id is provided', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbC',
                            orderId: 'clp293h4r000008l17n9fclbA',
                            productId: 'clp293h4r000008l17n9fclbE',
                            qte: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            order: {
                                userId: 'clp293h4r000008l17n9fclbB'
                            }
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
                id: 'clp293h4r000008l17n9fclbC'
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toBeInstanceOf(Object);
            expect(context.prisma.orderItem.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbC'
                },
                include: { order: true, product: true }
            });
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbC',
                orderId: 'clp293h4r000008l17n9fclbA',
                productId: 'clp293h4r000008l17n9fclbE',
                qte: 1,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                order: {
                    userId: 'clp293h4r000008l17n9fclbB'
                }
            });
        });
        it('should return orderItem when customer session with valid own id is provided', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbC',
                            orderId: 'clp293h4r000008l17n9fclbA',
                            productId: 'clp293h4r000008l17n9fclbE',
                            qte: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            order: {
                                userId: 'clp293h4r000008l17n9fclbB'
                            }
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
                id: 'clp293h4r000008l17n9fclbC'
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toBeInstanceOf(Object);
            expect(context.prisma.orderItem.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbC'
                },
                include: { order: true, product: true }
            });
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbC',
                orderId: 'clp293h4r000008l17n9fclbA',
                productId: 'clp293h4r000008l17n9fclbE',
                qte: 1,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                order: {
                    userId: 'clp293h4r000008l17n9fclbB'
                }
            });
        });
        it('should throw GraphQLError("Unauthorized") when no session is established', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue(null)
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbC'
            };
            try {
                await orderItems.orderItem(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Unauthorized");
                expect(error.extensions.code).toBe("UNAUTHORIZED");
                expect(context.prisma.orderItem.findUnique).not.toHaveBeenCalled();
            }
        });
        it('should return null when id is not a string', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue(null)
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
                id: 123
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toBeNull();
            expect(context.prisma.orderItem.findUnique).not.toHaveBeenCalled();
        });
        it('should return null when id is null', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue(null)
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
                id: null
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toBeNull();
            expect(context.prisma.orderItem.findUnique).not.toHaveBeenCalled();
        });

        it('should return null when id is undefined', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue(null)
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
                id: undefined
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toBeNull();
            expect(context.prisma.orderItem.findUnique).not.toHaveBeenCalled();
        });

        it('should throw GraphQLError("Access denied") when orderItem is not owned by customer', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbC',
                            orderId: 'clp293h4r000008l17n9fclbA',
                            productId: 'clp293h4r000008l17n9fclbE',
                            qte: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            order: {
                                userId: 'clp293h4r000008l17n9fclbB'
                            }
                        })
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbC'
            };
            try {
                await orderItems.orderItem(null, args, context);
                expect.fail("should have thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe("Access denied: You can only view your own order items");
                expect(error.extensions.code).toBe("ACCESS_DENIED");
                expect(context.prisma.orderItem.findUnique).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbC'
                    },
                    include: { order: true, product: true }
                });
            }
        });

        it('should return orderItem when admin session with valid id is provided', async () => {
            const context = createMockContext({
                prisma: {
                    orderItem: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbC',
                            orderId: 'clp293h4r000008l17n9fclbA',
                            productId: 'clp293h4r000008l17n9fclbE',
                            qte: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            order: {
                                userId: 'clp293h4r000008l17n9fclbB'
                            }
                        })
                    },
                    session: {
                        user: {
                            id: 'clp293h4r000008l17n9fclbD',
                            role: Role.ADMIN
                        }
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbZ',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                id: 'clp293h4r000008l17n9fclbC'
            };
            const result = await orderItems.orderItem(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbC',
                orderId: 'clp293h4r000008l17n9fclbA',
                productId: 'clp293h4r000008l17n9fclbE',
                qte: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                order: {
                    userId: 'clp293h4r000008l17n9fclbB'
                }
            });
            expect(context.prisma.orderItem.findUnique).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbC'
                },
                include: { order: true, product: true }
            });
        });
    });
});
