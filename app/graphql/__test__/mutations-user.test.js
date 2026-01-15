import { Role } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import mutationsUser from '@/app/graphql/mutations/users';
import { GraphQLError } from 'graphql';
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

describe('User mutations', () => {
    describe('Delete Customer Profile Tests', () => {
        // TODO: Test admin successfully deletes a user by userId
        it('should successfully delete a user by an admin', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue({ id: 'clp293h4r000008l17n9fclbB', image: null }),
                                delete: vi.fn().mockResolvedValue(true),
                            }
                        });
                    }),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                userId: 'clp293h4r000008l17n9fclbB'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
        })
        // TODO: Test customer attempting to delete another user deletes own account instead
        it('should successfully delete the signed in user , when there is no userId provided ', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue({ id: 'clp293h4r000008l17n9fclbB', image: null }),
                                delete: vi.fn().mockResolvedValue(true),
                            }
                        });
                    }),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {}
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
        })
        // TODO: Test unauthorized when no session provided
        it('should throw unauthorized when there is no session', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                userId: 'clp293h4r000008l17n9fclbB'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.delete).not.toHaveBeenCalled();
            }
        })
        // TODO: Test admin deletes with invalid userId throws not found
        it('should throw not found when admin tries to delete a non existing user', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('User not found', { code: 'P2025', clientVersion: '1.0.0' });
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue(null),
                                delete: vi.fn().mockRejectedValue(P2025Error),
                            }
                        });
                    }),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('User not found');
                expect(error.extensions.code).toBe('NOT_FOUND');
            }
        })
        // TODO: Test customer successfully deletes own account
        it('should successfully delete the signed in user', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue({ id: 'clp293h4r000008l17n9fclbB', image: null }),
                                delete: vi.fn().mockResolvedValue(true),
                            }
                        });
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
                userId: 'clp293h4r000008l17n9fclbB'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
        })
        // TODO: Test admin missing userId throws invalid user id error
        it('should throw invalid user id when admin tried to delete a user with an invalid user id', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                userId: null
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid user id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.user.delete).not.toHaveBeenCalled();
            }
        })
        // TODO: Test admin with non-string userId throws invalid user id error
        it('should throw invalid user id when admin tried to delete a user with a non-string user id', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                userId: 123
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Invalid user id');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.user.delete).not.toHaveBeenCalled();
            }
        })
        // TODO: Test customer providing userId still deletes own account
        it('should delete the signed in user account, when it tried to delete someone else account', async () => {
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue({ id: 'clp293h4r000008l17n9fclbB', image: null }),
                                delete: vi.fn().mockResolvedValue(true),
                            }
                        });
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
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
        })
        // TODO: Test user with invalid role throws unauthorized
        it('should throw unauthorized when user with invalid role tried to delete someone else account', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(),
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17nXxXxXx',
                        role: 'HACKER',
                    }
                }
            });
            const args = {
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.delete).not.toHaveBeenCalled();
            }
        })
        // TODO: Test other Prisma errors are re-thrown
        it('should throw foreign key constraint failed when admin try to delete a signed in user but it has orders', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2003 = new PrismaClientKnownRequestError('Foreign key constraint failed', { code: 'P2003' });
            const context = createMockContext({
                prisma: {
                    $transaction: vi.fn().mockImplementation((callback) => {
                        return callback({
                            user: {
                                findUnique: vi.fn().mockResolvedValue({ id: 'clp293h4r000008l17n9fclbZ', image: null }),
                                delete: vi.fn().mockRejectedValue(P2003),
                            }
                        });
                    }),
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbD',
                        role: Role.ADMIN,
                    }
                }
            });
            const args = {
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Foreign key constraint failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
            }
        })
    });

})