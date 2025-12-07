import { OrderStatus, Role } from "@prisma/client";

const resolvers = {
    Query: {
        //users functions ----------------------------------
        users: (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
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
            const { id } = args;
            if (!id || typeof id !== 'string') throw new Error("Invalid user id");
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
        usersCount: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
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
            const { id } = args;
            if (!id || typeof id !== 'string') throw new Error("Invalid order id");

            const order = await context.prisma.order.findUnique({
                where: { id },
                include: { user: true, items: true }
            });

            if (!order) throw new Error("Order not found");

            // ✅ SECURITY: Check order ownership (admins can see all, customers only theirs)
            if (order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
                throw new Error("Access denied: You can only view your own orders");
            }

            return order;
        },
        products: async (parent, args, context) => {
            const { limit, offset } = args;

            // ✅ FIXED: Proper validation that allows offset=0 and limit>=1
            if (limit === undefined || limit === null || typeof limit !== 'number' || limit < 1 || limit > 100) {
                throw new Error("Invalid limit: must be a number between 1 and 100");
            }
            if (offset === undefined || offset === null || typeof offset !== 'number' || offset < 0) {
                throw new Error("Invalid offset: must be a non-negative number");
            }

            // ✅ FIXED: Removed problematic deep includes that expose user data
            // Products query should not include order/orderItem data for privacy
            return await context.prisma.product.findMany({
                take: limit,
                skip: offset,
            });
        },
        // this is for the products that are still in stock
        availableProductsCount: async (parent, args, context) => {
            return await context.prisma.product.count({
                where: {
                    qteInStock: {
                        gt: 0
                    }
                }
            });
        },
        // this is for all the products even ones that are out of stock
        productsCount: async (parent, args, context) => {
            return await context.prisma.product.count();
        },
        product: async (parent, args, context) => {
            const { id } = args;
            if (!id || typeof id !== 'string') throw new Error("Invalid product id");
            return await context.prisma.product.findUnique({
                where: { id },
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
        //TODO: check from this function if still used ??
        productsInCart: async (parent, args, context) => {
            const ids = args.cart;
            if (!ids || ids.length === 0 || !Array.isArray(ids)) throw new Error("Invalid cart");
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
            const { id } = args;
            if (!id || typeof id !== 'string') throw new Error("Invalid order item id");

            const orderItem = await context.prisma.orderItem.findUnique({
                where: { id },
                include: { order: true, product: true }
            });

            if (!orderItem) throw new Error("Order item not found");

            // ✅ SECURITY: Check if order item belongs to current user (admins can see all)
            if (orderItem.order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
                throw new Error("Access denied: You can only view your own order items");
            }

            return orderItem;
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
        completeOrder: async (parent, args, context) => {
            if (!context.session || !(context?.session?.user?.role === Role.CUSTOMER)) {
                throw new Error("Unauthorized: Must be logged in as a customer to complete orders");
            }

            const { cart } = args;

            if (!cart || cart.length === 0) {
                throw new Error("Cart cannot be empty");
            }

            return await context.prisma.$transaction(async (tx) => {
                const total = cart.reduce((sum, item) => sum + (item.price * item.qte), 0);

                if (total <= 0) {
                    throw new Error("Order total must be greater than 0");
                }

                const items = cart.map(item => ({
                    productId: item.id,
                    qte: item.qte
                }));

                const order = await tx.order.create({
                    data: {
                        userId: context.session.user.id,
                        total: total,
                        status: OrderStatus.PENDING,
                        items: {
                            create: items
                        },
                    },
                    include: {
                        items: { include: { product: true } },
                        user: true
                    },
                });

                // Update product stock quantities
                for (const item of cart) {
                    await tx.product.update({
                        where: { id: item.id },
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
        completeSignUp: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }
            const { cart, phoneNumber, address } = args;

            if (!cart || cart.length === 0) {
                throw new Error("Cart cannot be empty");
            }

            if (!phoneNumber || !address) {
                throw new Error("Phone number and address are required");
            }

            return await context.prisma.$transaction(async (tx) => {
                const total = cart.reduce((sum, item) => sum + (item.price * item.qte), 0);
                const items = cart.map(item => ({
                    productId: item.id,
                    qte: item.qte,
                }))
                const order = await tx.order.create({
                    data: {
                        userId: context.session.user.id,
                        total: total,
                        status: OrderStatus.PENDING,
                        items: {
                            create: items,
                        }
                    },
                    include: { items: { include: { product: true } } }
                });
                // remove the ordered products from the total quantity in stock
                for (const item of cart) {
                    await tx.product.update({
                        where: { id: item.id },
                        data: {
                            qteInStock: {
                                decrement: item.qte
                            }
                        }
                    });
                }

                const updatedUser = await tx.user.update({
                    where: { id: context.session.user.id },
                    data: {
                        phoneNumber: phoneNumber,
                        address: address
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

            // ✅ SECURITY: Users can only update their own profile (unless admin)
            if (updatedUser.id !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
                throw new Error("Cannot update other users' profiles");
            }

            if (updatedUser.id && typeof updatedUser.id !== 'string') throw new Error("Invalid user id");
            if (updatedUser.name && typeof updatedUser.name !== 'string') throw new Error("Invalid user name");
            if (updatedUser.email && typeof updatedUser.email !== 'string') throw new Error("Invalid user email");
            if (updatedUser.phoneNumber && typeof updatedUser.phoneNumber !== 'string') throw new Error("Invalid user phone number");
            if (updatedUser.address && typeof updatedUser.address !== 'string') throw new Error("Invalid user address");

            // Prevent users from changing their own role
            if (updatedUser.role && updatedUser.role !== context.session.user.role && context.session.user.role !== Role.ADMIN) {
                throw new Error("Cannot change your own role");
            }

            return await context.prisma.user.update({ where: { id: updatedUser.id }, data: updatedUser });
        },
        deleteUserProfile: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            const { userId } = args;
            if (userId && typeof userId !== 'string') throw new Error("Invalid user id");
            return await context.prisma.user.delete({ where: { id: userId } });

        },
        addNewProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            const { product } = args;

            // ✅ COMPREHENSIVE VALIDATION
            if (!product || typeof product !== 'object') throw new Error("Invalid product data");
            if (!product.name || typeof product.name !== 'string' || product.name.trim().length < 1) throw new Error("Product name is required");
            if (!product.price || typeof product.price !== 'number' || product.price <= 0) throw new Error("Product price must be greater than 0");
            if (product.qteInStock === undefined || product.qteInStock === null || typeof product.qteInStock !== 'number' || product.qteInStock < 0) throw new Error("Product quantity must be 0 or greater");
            if (product.description && typeof product.description !== 'string') throw new Error("Product description must be a string");

            return await context.prisma.product.create({ data: product });
        },
        updateProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            const { updatedProduct } = args;

            // ✅ COMPREHENSIVE VALIDATION
            if (!updatedProduct || typeof updatedProduct !== 'object') throw new Error("Invalid product data");
            if (!updatedProduct.id || typeof updatedProduct.id !== 'string') throw new Error("Product id is required");

            // Validate each field if provided
            if (updatedProduct.name && (typeof updatedProduct.name !== 'string' || updatedProduct.name.trim().length < 1)) {
                throw new Error("Product name must be a non-empty string");
            }
            if (updatedProduct.description && typeof updatedProduct.description !== 'string') {
                throw new Error("Product description must be a string");
            }
            if (updatedProduct.price !== undefined && (typeof updatedProduct.price !== 'number' || updatedProduct.price <= 0)) {
                throw new Error("Product price must be greater than 0");
            }
            if (updatedProduct.qteInStock !== undefined && (typeof updatedProduct.qteInStock !== 'number' || updatedProduct.qteInStock < 0)) {
                throw new Error("Product quantity must be 0 or greater");
            }

            return await context.prisma.product.update({ where: { id: updatedProduct.id }, data: updatedProduct });
        },
        deleteProduct: async (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            const { productId } = args;
            if (productId && typeof productId !== 'string') throw new Error("Invalid product id");
            return await context.prisma.product.delete({ where: { id: productId } });

        },
    }
}

export default resolvers;
