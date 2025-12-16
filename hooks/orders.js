import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOrder, deleteOrder, fetchActiveOrdersCount, fetchOrder, fetchOrders, fetchOrdersCount, filteredOrdersCount, updateOrder } from "@/services/orders.client";
import { CreateOrderSchema, OrderFilterSchema, safeValidate, updateOrderSchema } from "@/lib/zodSchemas";
export function useOrders(initialData = [], filters = {}) {
    console.log('filters from the custom hook useOrders : ', filters);

    return useQuery({
        queryKey: ['orders', filters],
        queryFn: () => {
            const validation = safeValidate(OrderFilterSchema, filters)
            if (!validation.success) {
                throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
            }
            return fetchOrders(validation.data)
        },
        initialData
    })
}
export function useOrder(id) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => fetchOrder(id),
    })
}
export function useAddOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (new_order) => {
            const validation = safeValidate(CreateOrderSchema, new_order);
            if (!validation.success) {
                const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
                throw new Error(`Validation failed: ${errorMessages}`);
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
    console.log('useOrdersCount hook called');
    return useQuery({
        queryKey: ['ordersCount'],
        queryFn: fetchOrdersCount,
    })
}
export function useActiveOrdersCount(initialData) {
    return useQuery({
        queryKey: ['activeOrdersCount'],
        queryFn: fetchActiveOrdersCount,
        initialData
    })
}
export function useUpdateOrder(id) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            const validation = safeValidate(updateOrderSchema, data);
            if (!validation.success) {
                const errorMessages = Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; ');
                throw new Error(`Validation failed: ${errorMessages}`);
            }
            return updateOrder(id, validation.data);
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
        mutationFn: (id) => deleteOrder(id),
        onSuccess: (data) => {
            console.log('data from the deleteOrder mutation : ', data);
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
export function useCountFilteredOrders(filters = {}) {
    return useQuery({
        queryKey: ['countFilteredOrders', filters],
        queryFn: () => filteredOrdersCount(filters),
    })
}
