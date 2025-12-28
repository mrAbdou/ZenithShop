import { Role } from '@prisma/client';
import { describe, it, expect, vi } from 'vitest';
import mutationsProduct from '@/app/graphql/mutations/products';
import { GraphQLError } from 'graphql';
import { minProductNameLength } from '@/lib/constants';
const createMockContext = (overrides = {}) => {
    return {
        prisma: {
            product: {
                ...overrides.product,
            }
        },
        session: {
            ...overrides.session,
        },
        ...overrides,
    }
}
describe('Product Mutation Resolver Functions Tests', () => {
    describe('addNewProduct mutation resolver function Tests', () => {
        it('should create a new product when admin used it with all required and optional fields', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Product 01',
                            description: 'Product 01 description',
                            price: 10,
                            qteInStock: 10,
                            createdAt: new Date(),
                            updatedAt: new Date(),
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
                product: {
                    name: 'Product 01',
                    description: 'Product 01 description',
                    price: 10,
                    qteInStock: 10,
                },
            }
            const result = await mutationsProduct.addNewProduct(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbE',
                name: 'Product 01',
                description: 'Product 01 description',
                price: 10,
                qteInStock: 10,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(context.prisma.product.create).toHaveBeenCalledWith({
                data: {
                    name: 'Product 01',
                    description: 'Product 01 description',
                    price: 10,
                    qteInStock: 10,
                },
            })
        });
        it('should create a new product when admin used it with all required fields only', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Product 01',
                            price: 10,
                            qteInStock: 10,
                            createdAt: new Date(),
                            updatedAt: new Date(),
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
                product: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                },
            }
            const result = await mutationsProduct.addNewProduct(null, args, context);
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbE',
                name: 'Product 01',
                price: 10,
                qteInStock: 10,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(context.prisma.product.create).toHaveBeenCalledWith({
                data: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                },
            });
            expect(result.description).toBeUndefined();
        });
        it('should throw Unauthorized error when user tries to create new product', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED')
                expect(context.prisma.product.create).not.toHaveBeenCalled();
            }
        });
        it('should throw an error when create a new product with no session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue()
                    }
                },
            })
            const args = {
                product: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED')
                expect(context.prisma.product.create).not.toHaveBeenCalled();
            }
        });
        it('should throw an error when create a new product with wrong user role', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: 'HACKER'
                    }
                }
            });
            const args = {
                product: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED')
                expect(context.prisma.product.create).not.toHaveBeenCalled();
            }
        });
        it('should throw an error when create a new product with wrong name', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Pr@duct 01',
                    price: 10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST')
                expect(error.extensions.errors).toEqual([
                    { field: 'name', message: 'Product name contains invalid characters' },
                ])
                expect(context.prisma.product.create).not.toHaveBeenCalled();
            }
        });
        it('should throw an error when create a new product with missing name and wrong price', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockResolvedValue()
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
                product: {
                    price: -10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST')
                expect(error.extensions.errors).toEqual([
                    { field: 'name', message: 'Name is required as string' },
                    { field: 'price', message: `Price must be a positive number` },
                ])
                expect(context.prisma.product.create).not.toHaveBeenCalled();
            }
        });
        it('should throw a generic database error when create fails with unhandled error', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        create: vi.fn().mockRejectedValue(new Error('Some unhandled DB error'))
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
                product: {
                    name: 'Product 01',
                    price: 10,
                    qteInStock: 10,
                }
            }
            try {
                await mutationsProduct.addNewProduct(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Database operation failed');
            }
        })
    });
    describe('updateProduct mutation resolver function Tests', () => {
        // TODO: Test updating product with admin session and correct data - should succeed
        it('should update product with admin session and correct data', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Updated Product Name',
                            description: 'Updated Product Description',
                            price: 20,
                            qteInStock: 20,
                            createdAt: new Date(),
                            updatedAt: new Date(),

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
                product: {
                    name: 'Updated Product Name',
                    description: 'Updated Product Description',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            const result = await mutationsProduct.updateProduct(null, args, context);
            expect(result).toMatchObject({
                id: 'clp293h4r000008l17n9fclbE',
                name: 'Updated Product Name',
                description: 'Updated Product Description',
                price: 20,
                qteInStock: 20,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(context.prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'clp293h4r000008l17n9fclbE' },
                data: {
                    name: 'Updated Product Name',
                    description: 'Updated Product Description',
                    price: 20,
                    qteInStock: 20
                }
            })
        })
        // TODO: Test updating product with customer session and correct data - should fail with Unauthorized
        it('should throw an error when updating product with customer session and correct data', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Updated Product Name',
                            description: 'Updated Product Description',
                            price: 20,
                            qteInStock: 20,
                            createdAt: new Date(),
                            updatedAt: new Date(),

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
                product: {
                    name: 'Updated Product Name',
                    description: 'Updated Product Description',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        })
        // TODO: Test updating product with admin session and wrong data - should fail with Validation failed
        it('should throw an error when updating product with admin session and wrong data', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    { field: 'name', message: 'Product name contains invalid characters' },
                ])
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with customer session and wrong data - should fail with Unauthorized
        it('should throw an error when updating product with customer session and wrong data', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with admin session without id - should fail with Invalid product id
        it('should throw an error when updating product with admin session but with no id', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid product id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with customer session without id - should fail with Unauthorized
        it('should throw an error when updating product with customer session but with no id', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with no session - should fail with Unauthorized
        it('should throw an error when updating product with no session', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with invalid session role (e.g., 'HACKER') - should fail with Unauthorized
        it('should throw an error when updating product with invalid session role', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbE',
                        role: 'HACKER'
                    }
                }
            });
            const args = {
                product: {
                    name: 'Product@1',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product that doesn't exist - should fail with custom error for P2025
        it('should throw an error when updating product that doesn\'t exist', async () => {
            const { PrismaClientKnownRequestError } = require('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('P2025', {
                code: 'P2025',
                clientVersion: '5.1.1',
            });
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockRejectedValue(P2025Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbE',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                product: {
                    name: 'Product 01',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Product not found');
                expect(error.extensions.code).toBe('PRODUCT_NOT_FOUND');
                expect(context.prisma.product.update).toHaveBeenCalledWith({
                    where: { id: 'clp293h4r000008l17n9fclbE' },
                    data: {
                        name: 'Product 01',
                        price: 20,
                        qteInStock: 20
                    }
                });
            }
        });
        // TODO: Test updating product with database connection error - should fail with Database temporarily unavailable
        it('should throw an error when updating product with database connection error', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P1000Error = new PrismaClientKnownRequestError('Database connection error', {
                code: 'P1000',
                clientVersion: '5.1.1',
            });
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockRejectedValue(P1000Error)
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbE',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {
                product: {
                    name: 'Product 01',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Database temporarily unavailable');
                expect(error.extensions.code).toBe('DATABASE_TEMPORARILY_UNAVAILABLE');
                expect(context.prisma.product.update).toHaveBeenCalledWith({
                    where: { id: 'clp293h4r000008l17n9fclbE' },
                    data: {
                        name: 'Product 01',
                        price: 20,
                        qteInStock: 20
                    }
                });
            }
        });
        // TODO: Test updating product with invalid price (negative) - should fail with Validation failed
        it('should throw an error when updating product with negative price', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Product 01',
                    price: -20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'price',
                        message: 'Price must be a positive number'
                    }
                ]);
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with name too short/long or invalid characters - should fail with Validation failed
        it('should throw an error when updating product with name too short/long or invalid characters', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue()
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
                product: {
                    name: 'Pr',
                    price: 20,
                    qteInStock: 20
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            try {
                await mutationsProduct.updateProduct(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toEqual([
                    {
                        field: 'name',
                        message: `Product name must be at least ${minProductNameLength} characters`
                    }
                ]);
                expect(context.prisma.product.update).not.toHaveBeenCalled();
            }
        });
        // TODO: Test updating product with empty product object - should succeed if all optional, or fail if required
        it('should throw an error when updating product with empty product object', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Product 01',
                            price: 20,
                            qteInStock: 20,
                            createdAt: new Date(),
                            updatedAt: new Date()
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
                product: {},
                id: 'clp293h4r000008l17n9fclbE'
            };
            const result = await mutationsProduct.updateProduct(null, args, context);
            expect(result).toMatchObject({
                id: 'clp293h4r000008l17n9fclbE',
                name: 'Product 01',
                price: 20,
                qteInStock: 20,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(context.prisma.product.update).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbE'
                },
                data: {}
            });
        });
        // TODO: Test updating product with only optional fields (e.g., description) - should succeed
        it('should update product with only optional fields (e.g., description) - should succeed', async () => {
            const context = createMockContext({
                prisma: {
                    product: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbE',
                            name: 'Product 01',
                            description: 'Updated product description',
                            price: 20,
                            qteInStock: 20,
                            createdAt: new Date(),
                            updatedAt: new Date()
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
                product: {
                    description: 'Updated product description'
                },
                id: 'clp293h4r000008l17n9fclbE'
            };
            const result = await mutationsProduct.updateProduct(null, args, context);
            expect(result).toMatchObject({
                id: 'clp293h4r000008l17n9fclbE',
                name: 'Product 01',
                description: 'Updated product description',
                price: 20,
                qteInStock: 20,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(context.prisma.product.update).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbE'
                },
                data: {
                    description: 'Updated product description'
                }
            });
        });
    });

});
