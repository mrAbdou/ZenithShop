import { OrderStatus, Role } from "@prisma/client";

const resolvers = {
    Query: {
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
        allUsersCount: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw Error('unauthorized');
            return await context.prisma.user.count();
        },
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
            return await context.prisma.product.findMany({
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
            if (!context.session || !(context.session.user.role === Role.ADMIN)) throw Error('unauthorized');
            return await context.prisma.product.count();
        },
        product: async (parent, args, context) => {
            return await context.prisma.product.findUnique({
                where: { id: parseInt(args.id) },
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
            const ids = args.cart.map(id => parseInt(id));
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
        // TODO: still confusing between keeing this so user can be created and stored by prisma , or the better auth package will take care of it
        registerUser: async (parent, args, context) => {
            const { user } = args;
            return await context.prisma.user.create({ data: user });
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
            const { newProduct } = args;
            return await context.prisma.product.create({ data: newProduct });

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
