import prisma from "@/lib/prisma";
import { OrderStatus, Role } from "@prisma/client";

const resolvers = {
    Query: {
        //users functions ----------------------------------
        users: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            return context.prisma.user.findMany({
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
        customersCount: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            return await context.prisma.user.count({
                where: {
                    role: {
                        equals: Role.CUSTOMER
                    }
                }
            });
        },
        myOrders: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return await context.prisma.order.findMany({
                where: { userId: context.session.user.id },
                include: { items: { include: { product: true } } }
            });
        },
        user: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            return await context.prisma.user.findUnique({
                where: { id: parseInt(args.id) },
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
        usersCount: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw Error('unauthorized');
            return await context.prisma.user.count();
        },
        //orders functions ----------------------------------
        orders: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            return await context.prisma.order.findMany({
                include: { user: true, items: true }
            });
        },
        order: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return await context.prisma.order.findUnique({
                where: { id: parseInt(args.id) },
                include: { user: true, items: true }
            });
        },
        products: async (parent, args, context) => {
            const { limit, offset } = args;
            return await context.prisma.product.findMany({
                take: limit,
                skip: offset,
                include: {
                    orderItems: {
                        include: {
                            order: {
                                include: { user: true }
                            }
                        }
                    }
                }
            });
        },
        // this is for the products that sill in stock
        availableProductsCount: async (parent, args, context) => {
            return await context.prisma.product.count({
                where: {
                    qteInStock: {
                        gt: 0
                    }
                }
            });
        },
        // this is for all the products even onces that are out of stock
        productsCount: async (parent, args, context) => {
            return await context.prisma.product.count();
        },
        product: async (parent, args, context) => {
            console.log('from app/graphql/resolvers.js args : ', args);
            return await context.prisma.product.findUnique({
                where: { id: args.id },
                include: {
                    orderItems: {
                        include: {
                            order: {
                                include: { user: true }
                            }
                        }
                    }
                }
            });
        },
        productsInCart: async (parent, args, context) => {
            const ids = args.cart;
            return await context.prisma.product.findMany({
                where: { id: { in: ids } }
            });
        },
        orderItems: async (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            return await context.prisma.orderItem.findMany({
                include: { order: true, product: true }
            });
        },
        orderItem: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return await context.prisma.orderItem.findUnique({
                where: { id: parseInt(args.id) },
                include: { order: true, product: true }
            });
        },
        activeOrdersCount: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            return await context.prisma.order.count({
                where: {
                    status: {
                        notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED]
                    }
                }
            });
        }
    },

    Mutation: {
        completeSignUp: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) {
                throw new Error("Unauthorized");
            }

            return await context.prisma.$transaction(async (tx) => {
                // Calculate total
                const total = args.cart.reduce((sum, item) => sum + (item.price * item.qte), 0);

                // Create complete order with items in one operation
                const order = await tx.order.create({
                    data: {
                        userId: context.session.user.id, // Prisma handles relation automatically
                        total: total,
                        items: {
                            create: args.cart.map(item => ({
                                productId: item.id,
                                qte: item.qte
                            }))
                        }
                    },
                    include: { items: { include: { product: true } } }
                });

                // Update user profile
                const updatedUser = await tx.user.update({
                    where: { id: context.session.user.id },
                    data: {
                        phoneNumber: args.phoneNumber,
                        address: args.address
                    },
                    include: { orders: true }
                });

                return {
                    success: true,
                    user: updatedUser,
                    order: order
                };
            });
        },
        //TODO: do i have really need to let the user to update his profile information, the is e-commerce website not a social media place?
        updateUserProfile: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { updatedUser } = args;
            return await context.prisma.user.update({ where: { id: parseInt(updatedUser.id) }, data: updatedUser });
        },
        deleteUserProfile: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { userId } = args;
            return await context.prisma.user.delete({ where: { id: parseInt(userId) } });

        },
        addNewProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { product } = args;
            return await context.prisma.product.create({ data: product });

        },
        updateProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { updatedProduct } = args;
            return await context.prisma.product.update({ where: { id: parseInt(updatedProduct.id) }, data: updatedProduct });

        },
        deleteProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { productId } = args;
            return await context.prisma.product.delete({ where: { id: parseInt(productId) } });

        },
        makeAnOrder: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { order } = args;
            return await context.prisma.order.create({ data: order });

        },
        //TODO: i need to remove addProductToCart mutations and handle the cart only on client side
        addProductToCart: async (parent, args, context) => {
            const { orderItem } = args;
            return await context.prisma.orderItem.create({ data: orderItem });

        },
        //TODO: i need to remove removeProductFromCart mutations and handle the cart only on client side
        removeProductFromCart: async (parent, args, context) => {
            const { orderItemId } = args;
            return await context.prisma.orderItem.delete({ where: { id: parseInt(orderItemId) } });

        },

    }
}

export default resolvers;
