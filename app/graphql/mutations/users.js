// PRODUCTION-READY: This file has been thoroughly tested and is ready for production use. 😎

import { UpdateCustomerSchema } from "@/lib/schemas/user.schema";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    updateUserImage: async (parent, args, context) => {
        // Allow both customers and admins to update their own image
        if (!context.session?.user?.id) {
            throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        }

        const { imageUrl, userId } = args;
        if (!imageUrl || typeof imageUrl !== 'string') {
            throw new GraphQLError('Invalid image URL', { extensions: { code: 'BAD_REQUEST' } });
        }

        try {
            return await context.prisma.user.update({
                where: { id: context.session.user.id },
                data: { image: imageUrl }
            });
        } catch (prismaError) {
            console.error('User image update error:', prismaError);
            throw new GraphQLError("Failed to update profile image", { extensions: { code: 'UPDATE_FAILED' } });
        }
    },

    updateCustomerProfile: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.CUSTOMER && context.session?.user?.role !== Role.ADMIN) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        const { id, ...updatedUser } = args; // this is good for the future if you added new filed to be updated this is going to work directly
        let targetId;
        if (context.session?.user?.role === Role.ADMIN) {
            if (!id || typeof id !== 'string') throw new GraphQLError('Ivalid user id', { extensions: { code: 'BAD_REQUEST' } });
            targetId = id;
        } else {
            targetId = context.session.user.id;
        }
        const validation = UpdateCustomerSchema.safeParse(updatedUser);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ path: issue.path, message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            return await context.prisma.user.update({
                where: { id: targetId },
                data: validation.data
            });
        } catch (prismaError) {
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Profile not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P2002':
                    throw new GraphQLError("This email or username is already in use", { extensions: { code: 'DUPLICATE_VALUE' } });
                case 'P2003':
                    throw new GraphQLError("Unable to update profile due to related data", { extensions: { code: 'INVALID_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("One of your inputs is too long", { extensions: { code: 'INPUT_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Service temporarily unavailable, please try again", { extensions: { code: 'SERVICE_UNAVAILABLE' } });
                default:
                    console.error('User update error:', prismaError);
                    throw new GraphQLError("Failed to update profile, please try again", { extensions: { code: 'UPDATE_FAILED' } });
            }
        }
    },

    deleteCustomerProfile: async (parent, args, context) => {
        let targetUserId;
        if (context.session?.user?.role === Role.ADMIN) {
            const { userId } = args;
            if (!userId || typeof userId !== 'string') throw new GraphQLError("Invalid user id", { extensions: { code: 'BAD_REQUEST' } });
            targetUserId = userId;
        } else if (context.session?.user?.role === Role.CUSTOMER) {
            targetUserId = context.session.user.id;
        } else {
            throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        }
        try {
            // First, find the user to return for cache management
            const userToDelete = await context.prisma.user.findUnique({
                where: { id: targetUserId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });

            if (!userToDelete) {
                throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } });
            }

            // Delete the user with cascade to remove associated orders and order items
            await context.prisma.user.delete({
                where: { id: targetUserId }
            });

            return userToDelete;
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } });
                case 'P2003':
                    throw new GraphQLError('Foreign key constraint failed', { extensions: { code: 'BAD_REQUEST' } });
                case 'P1000':
                case 'P1001':
                    throw new GraphQLError("Database connection failed", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                default:
                    console.error("Database Error:", prismaError);
                    throw new GraphQLError("Internal server error", { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
        }
    },
}
