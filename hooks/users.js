import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCustomersCount,
    fetchMyOrders,
    fetchUser,
    fetchUsers,
    fetchUsersCount,
    updateCustomerProfile
} from "@/services/users.client";
import { FilteringUserPaginationSchema, UpdateCustomerSchema, UserPaginationSchema } from "@/lib/schemas/user.schema";
import toast from "react-hot-toast";
import ZodValidationError from "@/lib/ZodValidationError";

export function useUsers(variables, initialData) {
    return useQuery({
        queryKey: ['users', variables],
        queryFn: () => {
            const validation = UserPaginationSchema.safeParse(variables);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));
                throw new ZodValidationError('Validation failed', errors);
            }
            return fetchUsers(validation.data)
        },
        initialData: initialData ? initialData : []
    });
}
export function useUser(id) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => {
            if (!id || typeof id !== 'string') {
                return null;
            }
            return fetchUser({ id })
        },
        enabled: id && typeof id === 'string',
    });
}
export function useCustomersCount(initialData) {
    return useQuery({
        queryKey: ['customersCount'],
        queryFn: fetchCustomersCount,
        initialData: initialData ? initialData : 0
    });
}
export function useUsersCount(initialData) {
    return useQuery({
        queryKey: ['usersCount'],
        queryFn: fetchUsersCount,
        initialData: initialData ? initialData : 0
    });
}
export function useMyOrders(initialData) {
    return useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
        initialData: initialData ? initialData : []
    })
}

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCustomer) => {
            const validation = UpdateCustomerSchema.safeParse(updatedCustomer);
            if (!validation.success) {
                const errors = validation.error.issues.map(issue => ({
                    path: issue.path[0],
                    message: issue.message
                }));
                throw new ZodValidationError('Validation failed', errors);
            };
            return await updateCustomerProfile(validation.data);
        },
        onSuccess: (data) => {
            toast.success('Profile updated successfully');
            queryClient.setQueryData(['user', data.id], (oldData) => ({
                ...oldData,
                ...data
            }));
            queryClient.setQueryData(['users'], (oldData) => oldData?.map((user) => user.id === data.id ? { ...user, ...data } : user));
            queryClient.invalidateQueries({
                queryKey: ['user', data.id]
            });
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
        }
    });
}
