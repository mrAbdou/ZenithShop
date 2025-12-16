import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //complete sign up mutation
    completeSignUp: async (parent, args, context) => {
        console.log('complete sign up, resolver level (yoga backend server), data passed : ', args);
        if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) throw new GraphQLError('Unauthorized');
        const { phoneNumber, address, role } = args;
        if (!phoneNumber || !address || !role) throw new GraphQLError('Missing required fields');
        if (typeof phoneNumber !== 'string' || typeof address !== 'string') throw new GraphQLError('Invalid input types');
        const user = await context.prisma.user.update({
            where: { id: context.session.user.id },
            data: {
                phoneNumber,
                address,
                role
            }
        });
        return user;
    },

    deleteCustomerProfile: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        const { userId } = args;
        if (userId && typeof userId !== 'string') throw new GraphQLError("Invalid user id");
        return await context.prisma.user.delete({ where: { id: userId } });

    },
}