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
    describe('Complete Sign Up Tests', () => {
        // TODO: Test successful completion when valid args, session exists, and update succeeds
        it('should complete sign up successfully', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbB',
                            name: 'John Doe',
                            email: 'john.doe@example.com',
                            phoneNumber: '0554567890',
                            address: 'city 1600 el-khroub',
                            role: Role.CUSTOMER,
                        })
                    },
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    },
                },
            });
            const args = {
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
            }
            const result = await mutationsUser.completeSignUp(null, args, context);
            expect(context.prisma.user.update).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbB',
                },
                data: {
                    phoneNumber: '0554567890',
                    address: 'city 1600 el-khroub',
                }
            });
            expect(result).toEqual({
                id: 'clp293h4r000008l17n9fclbB',
                name: 'John Doe',
                email: 'john.doe@example.com',
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
                role: Role.CUSTOMER,
            });
        })
        // TODO: Test error when no session (context.session is null/undefined)
        it('should throw error when no session', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue(),
                    }
                }
            });
            const args = {
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
            }
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.update).not.toHaveBeenCalled();
            }
        })
        // TODO: Test error when args fail schema validation (e.g., invalid phoneNumber)
        it('should throw error when phone number is invalid', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue()
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
                phoneNumber: '055456789',
                address: 'city 1600 el-khroub',
            }
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors.length).toBe(1);
                expect(error.extensions.errors[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
                expect(context.prisma.user.update).not.toHaveBeenCalled();
            }
        })
        // TODO: Test error when Prisma update fails (e.g., user not found)
        it('should throw error when user not found', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue()
                    }
                }
            });
            const args = {
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
            }
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.update).not.toHaveBeenCalled();
            }
        })
        // TODO: Test that validation.data is used for update (phoneNumber transformed)
        it('should update user successfully, after correctly transforming the phone number', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue({
                            id: 'clp293h4r000008l17n9fclbB',
                            name: 'John Doe',
                            email: 'johnDoe@example.com',
                            phoneNumber: '0554567890',
                            address: 'city 1600 el-khroub',
                            role: Role.CUSTOMER,
                        })
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
                phoneNumber: '0554 56 78 90',
                address: 'city 1600 el-khroub',
            }
            const result = await mutationsUser.completeSignUp(null, args, context);
            expect(context.prisma.user.update).toHaveBeenCalledWith({
                where: {
                    id: 'clp293h4r000008l17n9fclbB',
                },
                data: {
                    phoneNumber: '0554567890',
                    address: 'city 1600 el-khroub',
                }
            });
            expect(result).toMatchObject({
                id: 'clp293h4r000008l17n9fclbB',
                name: 'John Doe',
                email: 'johnDoe@example.com',
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
                role: Role.CUSTOMER,
            });
            expect(result.phoneNumber).toBe('0554567890');
        })
        // TODO: Test GraphQL error structure (code, messages) for unauthorized/validation errors
        it('should throw user not found graphql error when there is a session but user not found', async () => {
            const { PrismaClientKnownRequestError } = await import('@prisma/client');
            const P2025Error = new PrismaClientKnownRequestError('User not found', { code: 'P2025', clientVersion: '1.2.3' });
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockRejectedValue(P2025Error)
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
                phoneNumber: '0554567890',
                address: 'city 1600 el-khroub',
            }
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(context.prisma.user.update).toHaveBeenCalledWith({
                    where: {
                        id: 'clp293h4r000008l17n9fclbB',
                    },
                    data: {
                        phoneNumber: '0554567890',
                        address: 'city 1600 el-khroub',
                    }
                });

                expect(error.message).toBe('User not found');
                expect(error.extensions.code).toBe('USER_NOT_FOUND');
            }
        });

        it('should throw an error when no data passed', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = {}
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(2);
                expect(error.extensions.errors[0].path).toEqual(['phoneNumber']);
                expect(error.extensions.errors[0].message).toBe('Phone number is required as String');
                expect(error.extensions.errors[1].path).toEqual(['address']);
                expect(error.extensions.errors[1].message).toBe('Address is required as String');
                expect(context.prisma.user.update).not.toHaveBeenCalled();
            }
        });

        it('should throw an error when no data passed', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        update: vi.fn().mockResolvedValue()
                    }
                },
                session: {
                    user: {
                        id: 'clp293h4r000008l17n9fclbB',
                        role: Role.CUSTOMER,
                    }
                }
            });
            const args = null;
            try {
                await mutationsUser.completeSignUp(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Validation failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(error.extensions.errors).toHaveLength(1);
                expect(error.extensions.errors[0].path).toEqual([]);
                expect(error.extensions.errors[0].message).toBe('Invalid input: expected object, received null');
                expect(context.prisma.user.update).not.toHaveBeenCalled();
            }
        });

    });
    describe('Delete Customer Profile Tests', () => {
        // TODO: Test admin successfully deletes a user by userId
        it('should successfully delete a user by an admin', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(true),
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
                userId: 'clp293h4r000008l17n9fclbB'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
            expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbB' } });
        })
        // TODO: Test customer attempting to delete another user deletes own account instead
        it('should successfully delete the signed in user , when there is no userId provided ', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(true)
                    }
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
            expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbB' } });
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
                    user: {
                        delete: vi.fn().mockRejectedValue(P2025Error),
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
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('User not found');
                expect(error.extensions.code).toBe('NOT_FOUND');
                expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbZ' } });
            }
        })
        // TODO: Test customer successfully deletes own account
        it('should successfully delete the signed in user', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        delete: vi.fn().mockResolvedValue(true),
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
                userId: 'clp293h4r000008l17n9fclbB'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
            expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbB' } });
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
                    user: {
                        delete: vi.fn().mockResolvedValue(),
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
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            const result = await mutationsUser.deleteCustomerProfile(null, args, context);
            expect(result).toBe(true);
            expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbB' } });
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
                    user: {
                        delete: vi.fn().mockRejectedValue(P2003),
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
                userId: 'clp293h4r000008l17n9fclbZ'
            }
            try {
                await mutationsUser.deleteCustomerProfile(null, args, context);
                expect.fail('should have thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Foreign key constraint failed');
                expect(error.extensions.code).toBe('BAD_REQUEST');
                expect(context.prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'clp293h4r000008l17n9fclbZ' } });
            }
        })
    });

})