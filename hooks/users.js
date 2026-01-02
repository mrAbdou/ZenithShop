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
import { CompleteSignUpSchema, UpdateCustomerSchema } from "@/lib/schemas/user.schema";
import toast from "react-hot-toast";
import ZodValidationError from "@/lib/ZodValidationError";

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
        queryFn: () => fetchUser({ id })
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
// export function useCompleteSignUp() {
//     return useMutation({
//         mutationFn: (data) => {
//             const validation = CompleteSignUpSchema.safeParse(data);
//             if (!validation.success) {
//                 const errors = validation.error.issues.map(issue => ({
//                     path: issue.path[0],
//                     message: issue.message
//                 }));
//                 throw new ZodValidationError('Validation failed', errors);
//             }
//             return completeSignUp(validation.data)
//         },
//     });
// }
export function useMyOrders(initialData = []) {
    return useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
        initialData
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
