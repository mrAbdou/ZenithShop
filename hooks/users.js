import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    completeSignUp,
    fetchCustomersCount,
    fetchMyOrders,
    fetchUser,
    fetchUsers,
    fetchUsersCount,
    updateCustomerProfile
} from "@/services/users.client";
import { UpdateCustomerSchema } from "@/lib/schemas/user.schema";
import toast from "react-hot-toast";

export function useUsers(initialData = []) {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        initialData
    });
}
export function useUser(id) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUser(id)
    });
}
export function useCustomersCount(initialData) {
    return useQuery({
        queryKey: ['customersCount'],
        queryFn: fetchCustomersCount,
        initialData
    });
}
export function useUsersCount(initialData) {
    return useQuery({
        queryKey: ['usersCount'],
        queryFn: fetchUsersCount,
        initialData
    });
}
export function useCompleteSignUp() {
    return useMutation({
        mutationFn: ({ phoneNumber, address, role }) => {
            console.log('complete sign up , custom hook level(react-query), passed data are : ', { phoneNumber, address, role });
            return completeSignUp(phoneNumber, address, role)
        }
    });
}
export function useMyOrders(initialData = []) {
    return useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
        initialData
    })
}
import { authClient } from "@/lib/auth-client";

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCustomer) => {
            console.log('update customer profile , custom hook level(react-query), passed data are : ', updatedCustomer);
            const validation = UpdateCustomerSchema.safeParse(updatedCustomer);
            if (!validation.success) throw new Error(Object.entries(validation.error.flatten().fieldErrors).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('; '));
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
