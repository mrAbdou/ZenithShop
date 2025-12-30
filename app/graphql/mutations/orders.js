import { CreateOrderSchema, updateOrderSchema } from "@/lib/schemas/order.schema";
import { OrderStatus, Role } from "@prisma/client";
import { GraphQLError } from "graphql";

export default {
    addOrder: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.CUSTOMER) {
            throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        }
        const userId = context.session.user.id;
        const { items, total } = args;
        const validation = CreateOrderSchema.safeParse({ items, total });
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            return await context.prisma.$transaction(async (tx) => {
                let calculatedTotal = 0;
                for (const item of items) {
                    const product = await tx.product.findUnique({ where: { id: item.productId }, select: { price: true, qteInStock: true } })
                    if (!product) throw new GraphQLError("Product not found", { extensions: { code: 'PRODUCT_NOT_FOUND' } });
                    if (product.qteInStock < item.qte) throw new GraphQLError("Not enough stock", { extensions: { code: 'NOT_ENOUGH_STOCK' } });
                    calculatedTotal += product.price * item.qte;
                }
                if (Math.abs(calculatedTotal - total) > 0.01) throw new GraphQLError("Total price does not match", { extensions: { code: 'TOTAL_PRICE_DOES_NOT_MATCH' } });
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
                    // i need to check if qteInStock is greater than item.qte
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
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2002':
                    throw new GraphQLError("Order already exists", { extensions: { code: 'ORDER_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    //TODO: update order mutation to manage updating the status of an order to cancelled , needs to increment the qteInStock of that product, so i need transaction in here too!
    //TODO: same thing for returned status too!!
    updateOrder: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { id, status } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order id", { extensions: { code: 'BAD_REQUEST' } });
        const validation = updateOrderSchema.safeParse({ status });
        if (!validation.success) {
            const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
            throw new GraphQLError('Validation failed', { extensions: { code: 'BAD_REQUEST', errors } });
        }
        try {
            return await context.prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({ where: { id }, select: { status: true, items: { select: { productId: true, qte: true } } } });
                if (!order) throw new GraphQLError("Order not found", { extensions: { code: 'NOT_FOUND' } });
                const isAlreadyCancelledOrReturned = [OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(order.status);
                const isGoingToBeCancelledOrReturned = [OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(validation.data.status);
                if (isGoingToBeCancelledOrReturned && isAlreadyCancelledOrReturned) {
                    return tx.order.findUnique({ where: { id } });
                } else if (isGoingToBeCancelledOrReturned && !isAlreadyCancelledOrReturned) {
                    const updatedOrder = await tx.order.update({ where: { id }, data: { status: validation.data.status } });
                    for (const item of order.items) {
                        await tx.product.update({ where: { id: item.productId }, data: { qteInStock: { increment: item.qte } } });
                    }
                    return updatedOrder;
                } else {
                    const updatedOrder = await tx.order.update({ where: { id }, data: { status: validation.data.status } });
                    return updatedOrder;
                }

            })
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Order not found", { extensions: { code: 'NOT_FOUND' } });
                case 'P2002':
                    throw new GraphQLError("Order already exists", { extensions: { code: 'ORDER_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    deleteOrder: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.ADMIN) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order id", { extensions: { code: 'BAD_REQUEST' } });
        try {
            return await context.prisma.order.delete({ where: { id } });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            console.log(JSON.stringify(prismaError, null, 2));
            switch (prismaError.code) {
                case 'P2025':
                    throw new GraphQLError("Order not found", { extensions: { code: 'ORDER_NOT_FOUND' } });
                case 'P2002':
                    throw new GraphQLError("Order already exists", { extensions: { code: 'ORDER_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    //console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    },

    cancelOrder: async (parent, args, context) => {
        if (context.session?.user?.role !== Role.CUSTOMER) throw new GraphQLError("Unauthorized", { extensions: { code: 'UNAUTHORIZED' } });
        const { id } = args;
        if (!id || typeof id !== 'string') throw new GraphQLError("Invalid order id", { extensions: { code: 'BAD_REQUEST' } });
        try {
            return await context.prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: {
                        id,
                        userId: context.session.user.id,
                        status: {
                            in: [OrderStatus.PENDING, OrderStatus.CONFIRMED]
                        }
                    },
                    select: {
                        items: {
                            select: {
                                productId: true,
                                qte: true
                            }
                        }
                    }
                });
                if (!order) throw new GraphQLError("Order not found", { extensions: { code: 'ORDER_NOT_FOUND' } });
                await tx.order.update({
                    where: { id },
                    data: { status: OrderStatus.CANCELLED }
                });
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { qteInStock: { increment: item.qte } }
                    });
                }

                return await tx.order.findUnique({ where: { id } });
            });
        } catch (prismaError) {
            if (prismaError instanceof GraphQLError) throw prismaError;
            switch (prismaError.code) {
                case 'P2002':
                    throw new GraphQLError("Order already exists", { extensions: { code: 'ORDER_ALREADY_EXISTS' } });
                case 'P2003':
                    throw new GraphQLError("Invalid data reference", { extensions: { code: 'INVALID_DATA_REFERENCE' } });
                case 'P2000':
                    throw new GraphQLError("Input value is too long", { extensions: { code: 'INPUT_VALUE_TOO_LONG' } });
                case 'P1001':
                case 'P1000':
                    throw new GraphQLError("Database temporarily unavailable", { extensions: { code: 'DATABASE_TEMPORARILY_UNAVAILABLE' } });
                default:
                    console.error('Unhandled database error : ', prismaError);
                    throw new GraphQLError("Database operation failed", { extensions: { code: 'DATABASE_OPERATION_FAILED' } });
            }
        }
    }
}