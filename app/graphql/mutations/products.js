import prisma from "@/lib/prisma";
import { AddProductSchema, UpdateProductSchema } from "@/lib/schemas/product.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    addNewProduct: async (parent, args, context) => {
        try {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
            const { product } = args;
            const validation = AddProductSchema.safeParse(product);
            if (!validation.success) {
                const errorMessages = Object.entries(validation.error.flatten().fieldErrors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('; ');
                throw new GraphQLError(`Validation failed: ${errorMessages}`);
            }
            return await context.prisma.product.create({ data: validation.data });
        } catch (prismaError) {
            // TODO: how I'm going to know these errors codes? I'm human not a machine!!
            switch (prismaError.code) {
                case 'P2002':
                    throw new GraphQLError("Product already exists");
                case 'P2003':
                    //TODO: ask for more information about this error Invalid data reference!
                    throw new GraphQLError("Invalid data reference");
                case 'P2000':
                    throw new GraphQLError("Input value is too long");
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable");
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed");
            }
        }
    },

    updateProduct: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { id, product } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id");
        if (!product || typeof product !== 'object') throw new GraphQLError("Invalid product");
        const validation = UpdateProductSchema.safeParse(product);
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new GraphQLError(`Validation failed: ${errorMessages}`);
        }
        return await context.prisma.product.update({
            where: { id },
            data: validation.data
        });
    },

    deleteProduct: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { productId } = args;
        if (!productId || typeof productId !== 'string') throw new GraphQLError("Invalid product id");
        return await context.prisma.product.delete({ where: { id: productId } });

    },
}