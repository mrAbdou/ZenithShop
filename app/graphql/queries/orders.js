import { OrderStatus, Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    // select signed in customer orders
    myOrders: async (parent, args, context) => {
        if (!(context.session?.user?.id)) throw new GraphQLError("Unauthorized");
        return await context.prisma.order.findMany({
            where: { userId: context.session.user.id },
            include: { items: { include: { product: true } } }
        });
    },
    // select all orders
    orders: async (parent, args, context) => {
        console.log('args from the resolver orders : ', args);
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { searchQuery, status, startDate, endDate, sortBy, sortDirection, currentPage, limit } = args;
        console.log('filters from the resolver orders : ', { searchQuery, status, startDate, endDate, sortBy, sortDirection });
        let where = {};
        let orderBy = {};

        if (status) {
            where.status = { equals: status }
        }

        if (searchQuery) {
            where.OR = [
                { id: { contains: searchQuery, mode: 'insensitive' } },
                { user: { name: { contains: searchQuery, mode: 'insensitive' } } }
            ];
        }

        if (startDate) {
            where.createdAt = { gte: new Date(startDate) };
        }

        if (endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
        }
        if (sortBy && sortDirection) {
            if (sortBy.includes('.')) {
                const [field, subField] = sortBy.split('.');
                orderBy = {
                    [field]: {
                        [subField]: sortDirection
                    }
                }
            } else {
                orderBy = {
                    [sortBy]: sortDirection
                }
            }
        }
        if (!currentPage && !limit) {
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
            skip: currentPage > 1 ? (currentPage - 1) * limit : 0,
            take: limit,
        });
    },

    // select a specific order
    order: async (parent, args, context) => {
        if (!context.session) throw new GraphQLError("Unauthorized");
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order id");

        const order = await context.prisma.order.findUnique({
            where: { id },
            include: { user: true, items: { include: { product: true } } }
        });

        if (!order) throw new GraphQLError("Order not found");

        if (order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
            throw new GraphQLError("Access denied: You can only view your own orders");
        }

        return order;
    },

    // select the total number of orders
    ordersCount: async (parent, args, context) => {
        if (!context.session || context.session.user.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
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