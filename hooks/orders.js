import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOrder, fetchActiveOrdersCount, fetchOrder, fetchOrders, fetchOrdersCount } from "@/services/orders.client";
import { CreateOrderSchema, OrderFilterSchema, safeValidate } from "@/lib/zodSchemas";
import toast from "react-hot-toast";
export function useOrders(initialData = [], filters) {
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
