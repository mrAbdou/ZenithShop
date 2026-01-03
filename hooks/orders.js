import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOrder, deleteOrder, fetchActiveOrdersCount, fetchOrder, fetchOrders, fetchOrdersCount, filteredOrdersCount, updateOrder } from "@/services/orders.client";
import { CreateOrderSchema, FilteredOrdersCountSchema, OrderFilterSchema, updateOrderSchema } from "@/lib/schemas/order.schema";
import ZodValidationError from "@/lib/ZodValidationError";
export function useOrders(filters, initialData) {

    return useQuery({
        queryKey: ['orders', filters],
        queryFn: () => {
            const validation = OrderFilterSchema.safeParse(filters)
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({ field: issue.path[0], message: issue.message }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return fetchOrders(validation.data)
        },
        initialData: initialData ? initialData : []
    })
}
export function useOrder(id) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => {
            if (!id || typeof id !== 'string') throw new Error('Invalid order ID');
            return fetchOrder({ id });
        },
    })
}
export function useAddOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (new_order) => {
            const validation = CreateOrderSchema.safeParse(new_order);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }))
                throw new ZodValidationError('Validation failed', errors);
            }
            return addOrder(validation.data);
        },
        onSuccess: (data) => {
            queryClient.setQueryData({
                queryKey: ['orders'],
                updater: (oldData) => {
                    return [...oldData, data];
                }
            });
            queryClient.setQueryData({
                queryKey: ['myOrders'],
                updater: (oldData) => {
                    return [...oldData, data];
                }
            });
            queryClient.setQueryData({
                queryKey: ['ordersCount'],
                updater: (oldData) => {
                    return oldData + 1;
                }
            });
            queryClient.setQueryData({
                queryKey: ['activeOrdersCount'],
                updater: (oldData) => {
                    return oldData + 1;
                }
            })
            queryClient.invalidateQueries(['orders', 'myOrders', 'ordersCount', 'ordersCount', 'activeOrdersCount']);
        }
    });
}
export function useOrdersCount() {
    return useQuery({
        queryKey: ['ordersCount'],
        queryFn: () => fetchOrdersCount(),
    })
}
export function useActiveOrdersCount(initialData) {
    return useQuery({
        queryKey: ['activeOrdersCount'],
        queryFn: () => fetchActiveOrdersCount(),
        initialData: initialData ? initialData : 0,
    })
}
export function useUpdateOrder(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            const validation = updateOrderSchema.safeParse(data);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }))
                throw new ZodValidationError('Validation failed', errors);
            }
            return updateOrder({ id, order: validation.data });
        },
        onSuccess: (data) => {

            queryClient.setQueryData(['orders'], (oldData) => {
                if (Array.isArray(oldData)) {
                    return oldData.map((order) => {
                        if (order.id === id) {
                            return data;
                        }
                        return order;
                    });
                }
                return oldData;
            });
            queryClient.setQueryData(['myOrders'], (oldData) => {
                if (Array.isArray(oldData)) {
                    return oldData.map((order) => {
                        if (order.id === id) {
                            return data;
                        }
                        return order;
                    });
                }
                return oldData;
            });
            queryClient.setQueryData(['order', id], data);
            queryClient.invalidateQueries(['orders', 'order', 'myOrders', 'ordersCount', 'activeOrdersCount']);
        }

    });
}
export function useDeleteOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => {
            if (!id || typeof id !== 'string') throw new Error('Invalid order ID');
            return deleteOrder({ id });
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['orders'], (oldData) => {
                if (Array.isArray(oldData)) {
                    return oldData.filter((order) => order.id !== data.id);
                }
                return oldData;
            });
            queryClient.setQueryData(['myOrders'], (oldData) => {
                if (Array.isArray(oldData)) {
                    return oldData.filter((order) => order.id !== data.id);
                }
                return oldData;
            });
            queryClient.setQueryData(['ordersCount'], (oldData) => {
                if (typeof oldData === 'number') {
                    return oldData - 1;
                }
                return oldData;
            });
            queryClient.setQueryData(['activeOrdersCount'], (oldData) => {
                if (typeof oldData === 'number') {
                    return oldData - 1;
                }
                return oldData;
            });
            queryClient.invalidateQueries(['orders', 'myOrders', 'ordersCount', 'activeOrdersCount']);
        }
    })
}
export function useCountFilteredOrders(filters) {
    return useQuery({
        queryKey: ['countFilteredOrders', filters],
        queryFn: () => {
            const validation = FilteredOrdersCountSchema.safeParse(filters)
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message
                }))
                throw new ZodValidationError('Validation failed', errors);
            }
            return filteredOrdersCount(validation.data)
        },
    })
}
