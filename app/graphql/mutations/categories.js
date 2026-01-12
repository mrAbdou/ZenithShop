import prisma from "@/lib/prisma";
import { CategoryCreateSchema, CategoryUpdateSchema } from "@/lib/schemas/category.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    createCategory: async (parent, args, context) => {
        // Check authorization for admin
        if (context?.session?.user?.role !== Role.ADMIN) {
            throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        }

        // Validate category data
        const validation = CategoryCreateSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }

        try {
            // Create the category
            const newCategory = await context.prisma.category.create({
                data: validation.data,
            });

            return newCategory;
        } catch (error) {
            if (error instanceof GraphQLError) throw error;

            // Handle Prisma errors
            switch (error.code) {
                case 'P2002':
                    throw new GraphQLError("Category already exists", { extensions: { code: 'CATEGORY_ALREADY_EXISTS' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Database error:', error);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    updateCategory: async (parent, args, context) => {
        if (context?.session?.user?.role !== Role.ADMIN) {
            throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        }
        const { id, ...newProductData } = args;

        // Validate category data
        const validation = CategoryUpdateSchema.safeParse(newProductData);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }

        try {
            // Update the category
            const updatedCategory = await context.prisma.category.update({
                where: { id: id },
                data: validation.data,
            });

            return updatedCategory;
        } catch (error) {
            if (error instanceof GraphQLError) throw error;

            // Handle Prisma errors
            switch (error.code) {
                case 'P2025':
                    throw new GraphQLError("Category not found", { extensions: { code: 'CATEGORY_NOT_FOUND' } });
                case 'P2002':
                    throw new GraphQLError("Category name already exists", { extensions: { code: 'CATEGORY_ALREADY_EXISTS' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Database error:', error);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    deleteCategory: async (parent, args, context) => {
        // Check authorization for admin
        if (context?.session?.user?.role !== Role.ADMIN) {
            throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        }

        const { id } = args;

        // Validate id
        if (!id || typeof id !== 'string') {
            throw new GraphQLError('Invalid category id', { extensions: { code: 'BAD_REQUEST' } });
        }

        try {
            // Delete the category
            const deletedCategory = await context.prisma.category.delete({
                where: { id },
            });

            return deletedCategory;
        } catch (error) {
            if (error instanceof GraphQLError) throw error;

            // Handle Prisma errors
            switch (error.code) {
                case 'P2025':
                    throw new GraphQLError("Category not found", { extensions: { code: 'CATEGORY_NOT_FOUND' } });
                case 'P2003':
                    throw new GraphQLError("Cannot delete category with existing products", { extensions: { code: 'CATEGORY_IN_USE' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Database error:', error);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },
}