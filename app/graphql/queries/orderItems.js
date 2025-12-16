import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    //select all order items
    orderItems: async (parent, args, context) => {
        if (!(context.session?.user?.role === Role.ADMIN)) throw new GraphQLError("Unauthorized");
        return await context.prisma.orderItem.findMany({
            include: { order: true, product: true }
        });
    },

    //select a single order item
    orderItem: async (parent, args, context) => {
        if (!context.session) throw new GraphQLError("Unauthorized");
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order item id");

        const orderItem = await context.prisma.orderItem.findUnique({
            where: { id },
            include: { order: true, product: true }
        });

        if (!orderItem) throw new GraphQLError("Order item not found");

        // ✅ SECURITY: Check if order item belongs to current user (admins can see all)
        if (orderItem.order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
            throw new GraphQLError("Access denied: You can only view your own order items");
        }

        return orderItem;
    },
}