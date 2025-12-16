import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //select all products
    products: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { searchQuery, startDate, endDate, sortBy, sortDirection, limit, currentPage } = args;
        let where = {};
        let orderBy = {};
        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } }
            ]
        }
        if (startDate) {
            where.createdAt = {
                gte: startDate
            }
        }
        if (endDate) {
            where.createdAt = {
                lte: endDate
            }
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
        if (limit && currentPage) {
            return await context.prisma.product.findMany({
                where,
                orderBy,
                take: limit,
                skip: (currentPage - 1) * limit
            })
        }
        return await context.prisma.product.findMany({
            where,
            orderBy,
        });
    },

    //select the total number of available products
    availableProductsCount: async (parent, args, context) => {
        return await context.prisma.product.count({
            where: {
                qteInStock: {
                    gt: 0
                }
            }
        });
    },

    //select the total number of products
    productsCount: async (parent, args, context) => {
        return await context.prisma.product.count();
    },

    //select a product by id
    product: async (parent, args, context) => {
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id");
        return await context.prisma.product.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        order: {
                            include: { user: true }
                        }
                    }
                }
            }
        });
    },

    //TODO: check from this function if still used ??
    productsInCart: async (parent, args, context) => {
        const ids = args.cart;
        if (!ids || ids.length === 0 || !Array.isArray(ids)) throw new GraphQLError("Invalid cart");
        return await context.prisma.product.findMany({
            where: { id: { in: ids } }
        });
    },

    filteredProductsCount: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { searchQuery, startDate, endDate } = args;
        let where = {};
        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } }
            ]
        }
        if (startDate) {
            where.createdAt = {
                gte: startDate
            }
        }
        if (endDate) {
            where.createdAt = {
                lte: endDate
            }
        }
        return await context.prisma.product.count({
            where,
        });
    }
}