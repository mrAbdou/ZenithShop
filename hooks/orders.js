import { useMutation, useQuery } from "@tanstack/react-query";
import { completeOrderForSignedInCustomer, fetchActiveOrdersCount, fetchOrder, fetchOrders, fetchOrdersCount } from "@/services/orders";
export function useOrders(initialData = []) {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        initialData
    })
}
export function useOrder(id) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => fetchOrder(id),
    })
}
export function useOrdersCount() {
    return useQuery({
        queryKey: ['ordersCount'],
        queryFn: fetchOrdersCount,
    })
}
export function useActiveOrdersCount() {
    return useQuery({
        queryKey: ['activeOrdersCount'],
        queryFn: fetchActiveOrdersCount,
    })
}
export function useCompleteOrderForSignedInCustomer() {
    return useMutation({
        mutationFn: (cart) => {
            console.log('from useCompleteOrderForSignedInCustomer custom hook :', { cart });
            return completeOrderForSignedInCustomer(cart)
        }
    })
}
