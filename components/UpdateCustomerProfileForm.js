'use client';

import { useUpdateCustomerProfile } from "@/hooks/users";
import { safeValidate, UpdateCustomerSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UpdateCustomerProfileForm({ initialData = {} }) {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: initialData.name || '',
            email: initialData.email || '',
            phoneNumber: initialData.phoneNumber || '',
            address: initialData.address || '',
        },
        resolver: zodResolver(UpdateCustomerSchema),
        mode: 'onChange',
    });
    const { mutateAsync: updateCustomerProfileAsync } = useUpdateCustomerProfile();
    const onSubmit = async (data) => {
        const validation = safeValidate(UpdateCustomerSchema, data);
        if (validation.error) {
            toast.error(validation.error.message);
            return;
        }
        try {
            await updateCustomerProfileAsync(validation.data, {
                onSuccess: () => {
                    toast.success('Profile updated successfully');
                    //needs to sign out after update
                    authClient.signOut();
                    router.push('/checkout');
                },
                onError: (error) => {
                    toast.error(error?.message || 'Failed to update profile');
                },
            });
            toast.success('Profile updated successfully');
            router.refresh(); // Refetch server component with updated session data
        } catch (error) {
            toast.error(error?.message || 'Failed to update profile');
        }
    }
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register('name')}
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register('email')}
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...register('phoneNumber')}
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            {...register('address')}
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
                    </div>
                </div>
                <input type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    value="Edit Profile"
                />
            </form>
        </div>
    )
}
