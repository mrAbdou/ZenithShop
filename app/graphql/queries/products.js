import { InfiniteProductSchema, ProductPaginationSchema } from "@/lib/schemas/product.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //select products for table pagination
    paginatedProducts: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized access", { extensions: { code: 'UNAUTHORIZED' } });
        const { searchQuery, stock, startDate, endDate, sortBy, sortDirection, limit, currentPage } = args;

        const validation = ProductPaginationSchema.safeParse({ searchQuery, stock, startDate, endDate, sortBy, sortDirection, limit, currentPage });
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            console.log('errors : ', errors);
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }

        let where = {};
        let orderBy = {};
        if (validation.data.searchQuery) {
            where.OR = [
                { id: { contains: validation.data.searchQuery, mode: "insensitive" } },
                { name: { contains: validation.data.searchQuery, mode: "insensitive" } },
                { description: { contains: validation.data.searchQuery, mode: "insensitive" } },
            ]
        }
        if (validation.data.stock) {
            const stockStatus = validation.data.stock.trim();
            switch (stockStatus) {
                case 'In Stock':
                    where.qteInStock = {
                        gt: 10
                    }
                    break;
                case 'Low Stock':
                    where.qteInStock = {
                        gt: 0,
                        lte: 10
                    }
                    break;
                case 'Out Stock':
                    where.qteInStock = {
                        equals: 0
                    }
                    break;
                default:
                    break;
            }
        }
        if (validation.data.startDate) {
            where.createdAt = {
                ...where.createdAt,
                gte: validation.data.startDate
            }
        }
        if (validation.data.endDate) {
            where.createdAt = {
                ...where.createdAt,
                lte: validation.data.endDate
            }
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



        if (validation.data.limit && validation.data.currentPage) {
            return await context.prisma.product.findMany({
                where,
                orderBy,
                take: validation.data.limit,
                skip: (validation.data.currentPage - 1) * validation.data.limit
            });
        }
        return await context.prisma.product.findMany({
            where,
            orderBy,
        });

    },

    //select products for infinite scroll
    infiniteProducts: async (parent, args, context) => {
        const { limit, offset } = args;
        const validation = InfiniteProductSchema.safeParse({ limit, offset });
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        return await context.prisma.product.findMany({
            take: validation.data.limit,
            skip: validation.data.offset
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
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id", { extensions: { code: 'BAD_REQUEST' } });
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

    //TODO: to be removed from hooks/products.js services/products.client.js services/products.server.js app/graphql/TypeDefinitions.js
    productsInCart: async (parent, args, context) => {
        const ids = args.cart;
        if (!ids || ids.length === 0 || !Array.isArray(ids)) throw new GraphQLError("Invalid cart");
        return await context.prisma.product.findMany({
            where: { id: { in: ids } }
        });
    },

    filteredProductsCount: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { searchQuery, stock, startDate, endDate } = args;
        let where = {};
        if (searchQuery) {
            where.OR = [
                { id: { contains: searchQuery, mode: "insensitive" } },
                { name: { contains: searchQuery, mode: "insensitive" } },
                { description: { contains: searchQuery, mode: "insensitive" } },
            ]
        }
        if (stock) {
            const stockStatus = stock.trim();
            switch (stockStatus) {
                case 'In Stock':
                    where.qteInStock = {
                        gt: 10
                    }
                    break;
                case 'Low Stock':
                    where.qteInStock = {
                        gt: 0,
                        lte: 10
                    }
                    break;
                case 'Out Stock':
                    where.qteInStock = {
                        equals: 0
                    }
                    break;
                default:
                    break;
            }
        }
        if (startDate) {
            where.createdAt = {
                ...where.createdAt,
                gte: startDate
            }
        }
        if (endDate) {
            where.createdAt = {
                ...where.createdAt,
                lte: endDate
            }
        }



        return await context.prisma.product.count({
            where,
        });
    }
}
