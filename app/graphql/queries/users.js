import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //select All users
    users: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.user.findMany({
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                }
            }
        });
    },
    //select a user by id
    user: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) throw new GraphQLError("Unauthorized");
        const id = context.session.user.id;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid user id");
        return await context.prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    }
                }
            }
        });
    },
    //count all customers (exclude admins)
    customersCount: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.user.count({
            where: {
                role: {
                    equals: Role.CUSTOMER
                }
            }
        });
    },
    //count all users
    usersCount: async (parent, args, context) => {
        if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.user.count();
    },
}