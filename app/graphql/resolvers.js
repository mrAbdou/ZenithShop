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
        myOrders: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return context.prisma.order.findMany({
                where: { userId: context.session.user.id },
                include: { items: { include: { product: true } } }
            });
        },
        user: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return context.prisma.user.findUnique({
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
        orders: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            return context.prisma.order.findMany({
                include: { user: true, items: true }
            });
        },
        order: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return context.prisma.order.findUnique({
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
        orderItems: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            return context.prisma.orderItem.findMany({
                include: { order: true, product: true }
            });
        },
        orderItem: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return context.prisma.orderItem.findUnique({
                where: { id: parseInt(args.id) },
                include: { order: true, product: true }
            });
        }
    },
    Mutation: {
        registerUser: (parent, args, context) => {
            const { user } = args;
            return context.prisma.user.create({ data: user });
        },
        //TODO: needs to be implemented properly according to auth system
        loginUser: (parent, args, context) => {
            const { loginUser } = args;
            return context.prisma.user.findUnique({ where: { email: loginUser.email } });
        },
        //TODO: needs to be implemented properly according to auth system
        logoutUser: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            return true;

        },
        //TODO: do i have really need to let the user to update his profile information, the is e-commerce website not a social media place?
        updateUserProfile: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { updatedUser } = args;
            return context.prisma.user.update({ where: { id: parseInt(updatedUser.id) }, data: updatedUser });

        },
        deleteUserProfile: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { userId } = args;
            return context.prisma.user.delete({ where: { id: parseInt(userId) } });

        },
        addNewProduct: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { newProduct } = args;
            return context.prisma.product.create({ data: newProduct });

        },
        updateProduct: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { updatedProduct } = args;
            return context.prisma.product.update({ where: { id: parseInt(updatedProduct.id) }, data: updatedProduct });

        },
        deleteProduct: (parent, args, context) => {
            if (!(context.session?.user?.role === 'ADMIN')) throw new Error("Unauthorized");
            const { productId } = args;
            return context.prisma.product.delete({ where: { id: parseInt(productId) } });

        },
        makeAnOrder: (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { order } = args;
            return context.prisma.order.create({ data: order });

        },
        //TODO: i need to remove addProductToCart mutations and handle the cart only on client side
        addProductToCart: (parent, args, context) => {
            const { orderItem } = args;
            return context.prisma.orderItem.create({ data: orderItem });

        },
        //TODO: i need to remove removeProductFromCart mutations and handle the cart only on client side
        removeProductFromCart: (parent, args, context) => {
            const { orderItemId } = args;
            return context.prisma.orderItem.delete({ where: { id: parseInt(orderItemId) } });

        },

    }
}

export default resolvers;
