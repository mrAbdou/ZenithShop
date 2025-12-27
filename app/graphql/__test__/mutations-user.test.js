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
            console.log(result);
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
                console.log('error : ', error);
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
            }
        })
        // TODO: Test that validation.data is used for update (phoneNumber transformed)
        // TODO: Test GraphQL error structure (code, messages) for unauthorized/validation errors
        // TODO: Test with mocked Prisma to verify update call with correct data
        // TODO: Test session user ID extraction from context.session.user.id

    })
})