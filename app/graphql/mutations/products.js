import { AddProductSchema, safeValidate, UpdateProductSchema } from "@/lib/zodSchemas";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    addNewProduct: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { product } = args;
        const validation = safeValidate(AddProductSchema, product);
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new GraphQLError(`Validation failed: ${errorMessages}`);
        }
        return await context.prisma.product.create({ data: validation.data });
    },

    updateProduct: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { id, updatedProduct } = args;

        const validation = safeValidate(UpdateProductSchema, updatedProduct);
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new GraphQLError(`Validation failed: ${errorMessages}`);
        }
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid product id");

        return await context.prisma.product.update({ where: { id }, data: validation.data });
    },

    deleteProduct: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { productId } = args;
        if (!productId || typeof productId !== 'string') throw new GraphQLError("Invalid product id");
        return await context.prisma.product.delete({ where: { id: productId } });

    },
}