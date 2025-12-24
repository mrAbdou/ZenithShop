import { describe, it, expect, vi } from "vitest";
import userQueries from "../queries/users";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";
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
        user: {
            id: 'cl0293h4r000008l17n9fclba',
            role: 'ADMIN'
        },
        ...overrides.session
    },
    ...overrides
});
describe('User Queries', () => {
    describe('Users Resolver Tests', () => {
        it('should return a list of users when the admin is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue([
                            {
                                id: 'cl0293h4r000008l17n9fclba',
                                name: 'john doe',
                                email: 'john.doe@example.com',
                                role: 'ADMIN'
                            }
                        ])
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000008l17n9fclba',
                        role: Role.ADMIN
                    }
                }
            });
            const args = {};
            const result = await userQueries.users(null, args, context);
            expect(context.prisma.user.findMany).toHaveBeenCalledWith({
                include: { orders: { include: { items: { include: { product: true } } } } }
            });
            expect(result).toEqual([
                {
                    id: 'cl0293h4r000008l17n9fclba',
                    name: 'john doe',
                    email: 'john.doe@example.com',
                    role: 'ADMIN'
                }
            ]);
        });
        it('should throw an error when trying to get the list of users without authorization of an admin', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findMany: vi.fn().mockResolvedValue()
                    }
                },
            });
            const args = {};
            try {
                await userQueries.users(null, args, context);
            } catch (error) {
                expect(error).toBeInstanceOf(GraphQLError);
                expect(error.message).toBe('Unauthorized');
                expect(error.extensions.code).toBe('UNAUTHORIZED');
                expect(context.prisma.user.findMany).not.toHaveBeenCalled();
            }

        });
    });
    describe('User Resolver Tests', () => {
        it('should return an object that contains user information when that user is signed in', async () => {
            const context = createMockContext({
                prisma: {
                    user: {
                        findUnique: vi.fn().mockResolvedValue({
                            id: 'cl0293h4r000108l17n9fclbb',
                            name: 'jane smith',
                            email: 'jane.smith@example.com',
                            role: Role.CUSTOMER
                        }),
                    }
                },
                session: {
                    user: {
                        id: 'cl0293h4r000108l17n9fclbb',
                        role: Role.CUSTOMER
                    }
                }
            });
            const args = {};
            const result = await userQueries.user(null, args, context);
            expect(context.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'cl0293h4r000108l17n9fclbb' },
                include: { orders: { include: { items: { include: { product: true } } } } }
            });
            expect(result).toEqual({
                id: 'cl0293h4r000108l17n9fclbb',
                name: 'jane smith',
                email: 'jane.smith@example.com',
                role: Role.CUSTOMER
            });
        });
        //TODO: test user resolver when the user is not signed in
    });
})