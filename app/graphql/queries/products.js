// PRODUCTION-READY: This file has been thoroughly tested and is ready for production use. 😎

import { FilteringProductPaginationSchema, InfiniteProductSchema, ProductPaginationSchema, FeaturedProductsSchema } from "@/lib/schemas/product.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";
// all of these queries are tested and proven to work
export default {
    //select products for table pagination
    paginatedProducts: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized access", { extensions: { code: 'UNAUTHORIZED' } });
        const validation = ProductPaginationSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
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
        if (validation.data.categoryId) {
            where.categoryId = validation.data.categoryId;
        }
        if (validation.data.minPrice) {
            where.price = {
                ...where.price,
                gte: validation.data.minPrice
            }
        }
        if (validation.data.maxPrice) {
            where.price = {
                ...where.price,
                lte: validation.data.maxPrice
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



        try {
            if (validation.data.limit && validation.data.currentPage) {
                return await context.prisma.product.findMany({
                    where,
                    orderBy,
                    take: validation.data.limit,
                    skip: (validation.data.currentPage - 1) * validation.data.limit,
                    include: {
                        category: true,
                    }
                });
            }
            return await context.prisma.product.findMany({
                where,
                orderBy,
                include: {
                    category: true
                }
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Record not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }

    },

    //select products for infinite scroll
    infiniteProducts: async (parent, args, context) => {
        const validation = InfiniteProductSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        let where = {};
        let orderBy = {};

        // Combine all filters into a single AND condition

        if (validation.data.searchQuery) {
            where = {
                OR: [
                    { name: { contains: validation.data.searchQuery, mode: 'insensitive' } },
                    { description: { contains: validation.data.searchQuery, mode: 'insensitive' } }
                ]
            };
        }

        if (validation.data.stock) {
            const stockStatus = validation.data.stock;
            switch (stockStatus) {
                case 'In Stock':
                    where = {
                        ...where,
                        qteInStock: {
                            gt: 10
                        }
                    }
                    break;
                case 'Low Stock':
                    where = {
                        ...where,
                        qteInStock: {
                            gt: 0,
                            lte: 10
                        }
                    }
                    break;
                case 'Out Stock':
                    where = {
                        ...where,
                        qteInStock: {
                            equals: 0
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        if (validation.data.minPrice || validation.data.maxPrice) {
            if (validation.data.minPrice) {
                where = {
                    ...where,
                    price: {
                        ...where.price,
                        gte: validation.data.minPrice
                    }
                }
            }
            if (validation.data.maxPrice) {
                where = {
                    ...where,
                    price: {
                        ...where.price,
                        lte: validation.data.maxPrice
                    }
                }
            }
        }

        if (validation.data.categoryId) {
            where = {
                ...where,
                categoryId: validation.data.categoryId
            }
        }

        if (validation.data.sortBy && validation.data.sortDirection) {
            orderBy = {
                [validation.data.sortBy]: validation.data.sortDirection
            }
        }
        try {
            return await context.prisma.product.findMany({
                where,
                orderBy,
                take: validation.data.limit,
                skip: validation.data.offset,
                include: {
                    category: true
                }
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Record not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },

    //select the total number of available products
    availableProductsCount: async (parent, args, context) => {
        try {
            return await context.prisma.product.count({
                where: {
                    qteInStock: {
                        gt: 0
                    }
                }
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },

    //select the total number of products
    productsCount: async (parent, args, context) => {
        try {
            return await context.prisma.product.count();
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },

    //select a product by id
    product: async (parent, args, context) => {
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id", { extensions: { code: 'BAD_REQUEST' } });
        try {
            return await context.prisma.product.findUnique({
                where: { id },
                include: {
                    orderItems: {
                        include: {
                            order: {
                                include: { user: true }
                            }
                        }
                    },
                    category: true
                }
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Product not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },

    filteredProductsCount: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const validation = FilteringProductPaginationSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        let where = {};
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
        if (validation.data.categoryId) {
            where.categoryId = validation.data.categoryId;
        }


        try {
            return await context.prisma.product.count({
                where,
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },

    featuredProducts: async (parent, args, context) => {
        const validation = FeaturedProductsSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            const products = await context.prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take: validation.data.head,
            });
            return products;
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Record not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    }
}
