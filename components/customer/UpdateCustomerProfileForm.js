'use client';

import { useUpdateCustomerProfile, useUser } from "@/hooks/users";
import { UpdateCustomerSchema } from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
export default function UpdateCustomerProfileForm() {
    const [errorMessages, setErrorMessages] = useState([]);
    const { data: session } = authClient.useSession();
    const { data: user, isLoading } = useUser(session?.user?.id);
    const router = useRouter();
    // TODO: email can't be updated, remove this email from all places 
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid, isDirty } } = useForm({
        defaultValues: {
            name: user?.name || '',
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
        },
        resolver: zodResolver(UpdateCustomerSchema),
        mode: 'onChange',
    });
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                phoneNumber: user.phoneNumber,
                address: user.address,
            });
        }
    }, [user]);
    //const { mutateAsync: updateCustomerProfileAsync } = useUpdateCustomerProfile();
    const onSubmit = async (updatedUser) => {
        setErrorMessages([]);
        try {
            //await updateCustomerProfileAsync(data);
            const { data, error } = await authClient.updateUser({
                name: updatedUser.name,
                phoneNumber: updatedUser.phoneNumber,
                address: updatedUser.address,
            });
            if (error) {
                const normalizedError = error.message.toLowerCase();
                const mappedErrors = [];
                if (normalizedError.includes('name')) {
                    mappedErrors.push({ field: 'name', message: error.message });
                } else if (normalizedError.includes('phone number')) {
                    mappedErrors.push({ field: 'phoneNumber', message: error.message });
                } else if (normalizedError.includes('address')) {
                    mappedErrors.push({ field: 'address', message: error.message });
                } else {
                    mappedErrors.push({ field: 'form', message: error.message });
                }
                setErrorMessages(mappedErrors);
                return;
            }
            toast.success('Profile updated successfully');
            router.refresh();
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
                    {/* Error Messages Display */}
                    {errorMessages.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 animate-pulse">
                            <div className="flex items-center mb-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="ml-2 text-lg font-semibold text-red-800">Update Failed</h3>
                            </div>
                            <div className="space-y-2">
                                {errorMessages.map((error, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="h-4 w-4 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-2 text-sm text-red-700 font-medium">
                                            {error.field === 'form' ? error.message : `${error.field}: ${error.message}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                disabled={isSubmitting}
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register('name')}
                            />
                            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                disabled={isSubmitting}
                                type="tel"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                {...register('phoneNumber')}
                            />
                            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber?.message}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                disabled={isSubmitting}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                {...register('address')}
                            />
                            <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
                        </div>
                    </div>
                    <input type="submit"
                        disabled={isSubmitting || !isValid || !isDirty}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSubmitting || !isValid || !isDirty
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                        value="Edit Profile"
                    />
                </form>
            )}
        </div>
    )
}
