import { CreateOrderSchema, safeValidate, updateOrderSchema } from "@/lib/zodSchemas";
import { OrderStatus, Role } from "@prisma/client";

const resolvers = {
    Query: {
        //users functions ----------------------------------
        users: async (parent, args, context) => {
            if (!(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
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
            if (!context.session?.user?.id) throw new Error("Unauthorized");
            return await context.prisma.order.findMany({
                where: { userId: context.session.user.id },
                include: { items: { include: { product: true } } }
            });
        },
        user: async (parent, args, context) => {
            if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) throw new Error("Unauthorized");
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
            console.log('args from the resolver orders : ', args);
            //TODO: you need to find a way to pass the filters to the resolver, because GQL GET_ORDERS doesn't support variables
            if (!context.session || !(context.session?.user?.role === Role.ADMIN)) throw new Error("Unauthorized");
            const { searchQuery, status, startDate, endDate, sortBy, sortDirection } = args;
            console.log('filters from the resolver orders : ', { searchQuery, status, startDate, endDate, sortBy, sortDirection });

            let where = {
                status: { equals: status }
            };
            let orderBy = {};


            if (searchQuery) {
                where.OR = [
                    { id: { contains: searchQuery, mode: 'insensitive' } },
                    { user: { name: { contains: searchQuery, mode: 'insensitive' } } }
                ];
            }

            if (startDate) {
                where.createdAt = { gte: new Date(startDate) };
            }

            if (endDate) {
                where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
            }
            if (sortBy && sortDirection) {
                if (sortBy.includes('.')) {
                    const [field, subField] = sortBy.split('.');
                    orderBy = {
                        [field]: {
                            [subField]: sortDirection
                        }
                    }
                } else {
                    orderBy = {
                        [sortBy]: sortDirection
                    }
                }
            }
            return await context.prisma.order.findMany({
                include: { user: true, items: true },
                where,
                orderBy
            });
        },
        order: async (parent, args, context) => {
            if (!context.session) throw new Error("Unauthorized");
            const { id } = args;
            if (!id || typeof id !== 'string') throw new Error("Invalid order id");

            const order = await context.prisma.order.findUnique({
                where: { id },
                include: { user: true, items: { include: { product: true } } }
            });

            if (!order) throw new Error("Order not found");

            // ✅ SECURITY: Check order ownership (admins can see all, customers only theirs)
            if (order.userId !== context.session.user.id && context.session.user.role !== Role.ADMIN) {
                throw new Error("Access denied: You can only view your own orders");
            }

            return order;
        },
        ordersCount: async (parent, args, context) => {
            if (!context.session || context.session.user.role !== Role.ADMIN) throw new Error("Unauthorized");
            return await context.prisma.order.count();
        },

        products: async (parent, args, context) => {
            const { limit, offset } = args;
            if (limit === undefined || limit === null || typeof limit !== 'number' || limit < 1 || limit > 100 || limit % 1 !== 0) {
                throw new Error("Invalid limit: must be an integer between 1 and 100");
            }
            if (offset === undefined || offset === null || typeof offset !== 'number' || offset < 0 || offset % 1 !== 0) {
                throw new Error("Invalid offset: must be a non-negative integer");
            }
            return await context.prisma.product.findMany({
                take: limit,
                skip: offset
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
        completeSignUp: async (parent, args, context) => {
            console.log('complete sign up, resolver level (yoga backend server), data passed : ', args);
            if (!context.session || !(context.session?.user?.role === Role.CUSTOMER)) throw new Error('Unauthorized');
            const { phoneNumber, address, role } = args;
            if (!phoneNumber || !address || !role) throw new Error('Missing required fields');
            if (typeof phoneNumber !== 'string' || typeof address !== 'string') throw new Error('Invalid input types');
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
        addOrder: async (parent, args, context) => {
            if (!context.session || !(context?.session?.user?.role === Role.CUSTOMER)) {
                throw new Error("Unauthorized: Must be logged in as a customer to complete orders");
            }
            const userId = context.session.user.id;
            const { items, total } = args;
            const validation = safeValidate(CreateOrderSchema, { items, total });
            if (!validation.success) {
                const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
                throw new Error(`Validation failed: ${errorMessages}`);
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

        deleteCustomerProfile: async (parent, args, context) => {
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
        updateOrder: async (parent, args, context) => {
            if (!context.session || context.session.user.role !== Role.ADMIN) throw new Error("Unauthorized");
            const { id, status } = args;
            if (id && typeof id !== 'string') throw new Error("Invalid order id");
            const validation = safeValidate(updateOrderSchema, { status });
            if (!validation.success) {
                const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
                throw new Error(`Validation failed: ${errorMessages}`);
            }
            return await context.prisma.order.update({ where: { id }, data: { status: validation.data.status } });
        },
        deleteOrder: async (parent, args, context) => {
            if (!context.session || context.session.user.role !== Role.ADMIN) throw new Error("Unauthorized");
            const { id } = args;
            if (id && typeof id !== 'string') throw new Error("Invalid order id");
            return await context.prisma.order.delete({ where: { id } });
        }
    },
}

export default resolvers;
