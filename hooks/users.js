import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCustomersCount, fetchUser, fetchUsers, fetchUsersCount } from "@/services/users";
export function useUsers(initialData) {
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
export function useCustomersCount() {
    return useQuery({
        queryKey: ['customersCount'],
        queryFn: fetchCustomersCount
    });
}
export function useUsersCount() {
    return useQuery({
        queryKey: ['usersCount'],
        queryFn: fetchUsersCount
    });
}
