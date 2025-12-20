import { CreateOrderSchema, updateOrderSchema } from "@/lib/schemas/order.schema";
import { OrderStatus, Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    addOrder: async (parent, args, context) => {
        if (!context.session || !(context?.session?.user?.role === Role.CUSTOMER)) {
            throw new GraphQLError("Unauthorized: Must be logged in as a customer to complete orders");
        }
        const userId = context.session.user.id;
        const { items, total } = args;
        const validation = CreateOrderSchema.safeParse({ items, total });
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new GraphQLError(`Validation failed: ${errorMessages}`);
        }
        return await context.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    user: {
                        connect: {
                            id: userId,
                        }
                    },
                    total: total,
                    status: OrderStatus.PENDING,
                    items: {
                        create: items.map(item => ({
                            product: {
                                connect: {
                                    id: item.productId,
                                }
                            },
                            qte: item.qte,
                        }))
                    },
                },
                include: {
                    items: { include: { product: true } },
                    user: true
                },
            });

            // Update product stock quantities
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        qteInStock: {
                            decrement: item.qte
                        }
                    }
                });
            }

            return order;
        });
    },

    updateOrder: async (parent, args, context) => {
        if (!context.session || context.session.user.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { id, status } = args;
        if (id && typeof id !== 'string') throw new GraphQLError("Invalid order id");
        const validation = updateOrderSchema.safeParse({ status });
        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
            throw new GraphQLError(`Validation failed: ${errorMessages}`);
        }
        return await context.prisma.order.update({ where: { id }, data: { status: validation.data.status } });
    },

    deleteOrder: async (parent, args, context) => {
        if (!context.session || context.session.user.role !== Role.ADMIN) throw new GraphQLError("Unauthorized");
        const { id } = args;
        if (id && typeof id !== 'string') throw new GraphQLError("Invalid order id");
        return await context.prisma.order.delete({ where: { id } });
    }
}