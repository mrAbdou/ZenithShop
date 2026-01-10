import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { CategoryFilterSchema, FeaturedCategoriesSchema } from '@/lib/schemas/category.schema';

export default {
    featuredCategories: async (parent, args, context) => {
        const validation = FeaturedCategoriesSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new GraphQLError("Validation Error", { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            const categories = await context.prisma.category.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take: validation.data.head,
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            });
            return categories;
        } catch (prismaError) {
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
    categories: async (parent, args, context) => {
        try {
            const categories = await context.prisma.category.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return categories;
        } catch (prismaError) {
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

    countFilteredCategories: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.ADMIN) {
            throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        }
        const validation = CategoryFilterSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'VALIDATION_FAILED', errors } });
        }

        try {
            // Build the where clause for filtering
            const where = {};

            // Add search query filter if provided
            if (validation.data.searchQuery) {
                where.name = {
                    contains: validation.data.searchQuery,
                    mode: 'insensitive' // Case-insensitive search
                };
            }

            // Count categories that match the filter criteria
            const count = await context.prisma.category.count({
                where: where
            });

            return count;
        } catch (error) {
            console.error('Error counting filtered categories:', error);
            throw new GraphQLError("Failed to count filtered categories", {
                extensions: { code: 'DATABASE_OPERATION_FAILED' }
            });
        }
    }
};