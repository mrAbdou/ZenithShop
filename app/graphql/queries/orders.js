import { OrderFilterSchema } from "@/lib/schemas/order.schema";
import { OrderStatus, Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    // select signed in customer orders
    myOrders: async (parent, args, context) => {
        if (!(context.session?.user?.id && context.session.user.role === Role.CUSTOMER)) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        return await context.prisma.order.findMany({
            where: { userId: context.session.user.id },
            include: { items: { include: { product: true } } }
        });
    },
    // select all orders
    //should only be used by admin because this function is build for the table pagination only
    orders: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { searchQuery, status, startDate, endDate, sortBy, sortDirection, currentPage, limit } = args;
        const validation = OrderFilterSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                path: issue.path,
                message: issue.message
            }));
            throw new GraphQLError("Validation failed", { extensions: { code: 'VALIDATION_FAILED', errors } });
        }
        let where = {};
        let orderBy = {};

        if (validation.data.status) {
            where.status = { equals: validation.data.status }
        }

        if (validation.data.searchQuery) {
            where.OR = [
                { id: { contains: validation.data.searchQuery, mode: 'insensitive' } },
                { user: { name: { contains: validation.data.searchQuery, mode: 'insensitive' } } }
            ];
        }

        if (validation.data.startDate) {
            where.createdAt = { gte: new Date(validation.data.startDate) };
        }

        if (validation.data.endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(validation.data.endDate) };
        }
        if (validation.data.sortBy && validation.data.sortDirection) {
            if (validation.data.sortBy.includes('.')) {
                const [field, subField] = validation.data.sortBy.split('.');
                orderBy = {
                    [field]: {
                        [subField]: validation.data.sortDirection
                    }
                }
            } else {
                orderBy = {
                    [validation.data.sortBy]: validation.data.sortDirection
                }
            }
        }
        if (!validation.data.currentPage && !validation.data.limit) {
            return await context.prisma.order.findMany({
                include: { user: true, items: true },
                where,
                orderBy,
            });
        }
        return await context.prisma.order.findMany({
            include: { user: true, items: true },
            where,
            orderBy,
            skip: validation.data.currentPage > 1 ? (validation.data.currentPage - 1) * validation.data.limit : 0,
            take: validation.data.limit,
        });
    },

    // TODO: Create tests for order resolver in orderQueries.test.js - test valid string id returns order (with access control), invalid id types/null/undefined throw errors, no session throws Unauthorized.
    // select a specific order
    order: async (parent, args, context) => {
        if (!context.session) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order id", { extensions: { code: 'BAD_USER_INPUT' } });

        const order = await context.prisma.order.findUnique({
            where: { id },
            include: { user: true, items: { include: { product: true } } }
        });

        if (!order) throw new GraphQLError("Order not found", { extensions: { code: 'NOT_FOUND' } });

        if (order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
            throw new GraphQLError("Access denied: You can only view your own orders", { extensions: { code: 'FORBIDDEN' } });
        }

        return order;
    },

    // select the total number of orders
    ordersCount: async (parent, args, context) => {
        if (!context.session || context.session.user.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        return await context.prisma.order.count();
    },

    //count active orders
    activeOrdersCount: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.order.count({
            where: {
                status: {
                    notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED]
                }
            }
        });
    },

    filteredOrdersCount: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { searchQuery, status, startDate, endDate } = args;
        let where = {};

        if (searchQuery) {
            where.OR = [
                { id: { contains: searchQuery, mode: 'insensitive' } },
                { user: { name: { contains: searchQuery, mode: 'insensitive' } } }
            ];
        }

        if (status) {
            where.status = { equals: status }
        }

        if (startDate) {
            where.createdAt = { gte: new Date(startDate) };
        }

        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
        }

        return await context.prisma.order.count({
            where,
        });
    }
}
