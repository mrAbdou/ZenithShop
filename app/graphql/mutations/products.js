// PRODUCTION-READY: This file has been thoroughly tested and is ready for production use. 😎

import prisma from "@/lib/prisma";
import { AddProductSchema, UpdateProductSchema } from "@/lib/schemas/product.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    addNewProduct: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { product } = args;
        const validation = AddProductSchema.safeParse(product);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            return await context.prisma.product.create({ data: validation.data });
        } catch (prismaError) {
            switch (prismaError.code) {
                case 'P2002':
                    throw new GraphQLError("Product already exists", { extensions: { code: 'PRODUCT_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    updateProduct: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { id, product } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id", { extensions: { code: 'BAD_REQUEST' } });
        const validation = UpdateProductSchema.safeParse(product);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            return await context.prisma.product.update({
                where: { id },
                data: validation.data
            });
        } catch (prismaError) {
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Product not found", { extensions: { code: 'PRODUCT_NOT_FOUND' } });
                case 'P2002':
                    throw new GraphQLError("Product already exists", { extensions: { code: 'PRODUCT_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    deleteProduct: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { productId } = args;
        if (!productId || typeof productId !== 'string') throw new GraphQLError("Invalid product id", { extensions: { code: 'BAD_REQUEST' } });
        try {
            return await context.prisma.product.delete({ where: { id: productId } });
        } catch (prismaError) {
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Product not found", { extensions: { code: 'PRODUCT_NOT_FOUND' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },
}
