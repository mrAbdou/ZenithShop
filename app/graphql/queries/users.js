import { UserPaginationSchema } from "@/lib/schemas/user.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //select All users
    users: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { searchQuery, role, startDate, endDate, sortBy, sortDirection, limit, currentPage } = args;
        let where = {};
        let orderBy = {};
        const validation = UserPaginationSchema.safeParse({
            searchQuery,
            role,
            startDate,
            endDate,
            sortBy,
            sortDirection,
            limit,
            currentPage
        });
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        if (validation.data.searchQuery) {
            where.OR = [
                { id: { contains: validation.data.searchQuery, mode: 'insensitive' } },
                { name: { contains: validation.data.searchQuery, mode: 'insensitive' } },
                { email: { contains: validation.data.searchQuery, mode: 'insensitive' } }
            ]
        }
        if (validation.data.role) {
            where.role = validation.data.role;
        }
        if (validation.data.startDate) {
            where.createdAt = {
                ...where.createdAt,
                gte: validation.data.startDate,
            }
        }
        if (validation.data.endDate) {
            where.createdAt = {
                ...where.createdAt,
                lte: validation.data.endDate,
            }
        }
        if (validation.data.sortBy && validation.data.sortDirection) {
            orderBy = {
                [validation.data.sortBy]: validation.data.sortDirection,
            }
        }
        if (validation.data.limit && validation.data.currentPage) {
            return await context.prisma.user.findMany({
                where,
                orderBy,
                take: limit,
                skip: (currentPage - 1) * limit,
                include: {
                    orders: {
                        include: {
                            items: {
                                include: { product: true }
                            }
                        }
                    }
                }
            });
        } else {
            return await context.prisma.user.findMany({
                where,
                orderBy,
                include: {
                    orders: {
                        include: {
                            items: {
                                include: { product: true }
                            }
                        }
                    }
                }
            });
        }
    },
    //select a user by id
    user: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const id = context.session.user.id;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid user id");
        return await context.prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                }
            }
        });
    },
    //count all customers (exclude admins)
    customersCount: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        return await context.prisma.user.count({
            where: {
                role: {
                    equals: Role.CUSTOMER
                }
            }
        });
    },
    //count all users
    usersCount: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.user.count();
    },
}