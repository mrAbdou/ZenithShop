import { CompleteSignUpSchema } from "@/lib/schemas/user.schema";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //complete sign up mutation
    completeSignUp: async (parent, args, context) => {

        if (!context.session?.user?.id) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        const validation = CompleteSignUpSchema.safeParse(args);
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ path: issue.path, message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            const user = await context.prisma.user.update({
                where: { id: context.session.user.id },
                data: validation.data
            });
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } });
            }
            throw error;
        }
    },

    deleteCustomerProfile: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { userId } = args;
        if (userId && typeof userId !== 'string') throw new GraphQLError("Invalid user id");
        return await context.prisma.user.delete({ where: { id: userId } });

    },
}