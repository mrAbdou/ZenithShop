'use client';

import { useUpdateCustomerProfile, useUser } from "@/hooks/users";
import { safeValidate, UpdateCustomerSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function UpdateCustomerProfileForm({ initialData = {} }) {
    const router = useRouter();
    const { data: user, isLoading } = useUser(initialData.id);
    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user]);
    // TODO: email can't be updated, remove this email from all places 
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
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
            await updateCustomerProfileAsync(validation.data);
            router.refresh(); // Refetch server component with updated session data
        } catch (error) {
            toast.error(error?.message || 'Failed to update profile');
        }
    }
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            {isLoading ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Loading your profile information...</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-1">Name</div>
                            <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                        <div>
                            <div className="block text-sm font-medium text-gray-700 mb-1">Phone</div>
                            <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="block text-sm font-medium text-gray-700 mb-1">Address</div>
                            <div className="h-20 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    </div>
                    <div className="h-10 bg-orange-600 animate-pulse rounded-md w-24"></div>
                </div>
            ) : (
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
            )}
        </div>
    )
}
