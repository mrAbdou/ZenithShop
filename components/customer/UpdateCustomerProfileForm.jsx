'use client';

import { useUpdateCustomerProfile, useUser } from "@/hooks/users";
import { UpdateCustomerSchema } from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { validateImage } from "@/lib/supabase";
import { uploadProfileImageAction, deleteAvatarAction } from "@/app/actions/upload";
export default function UpdateCustomerProfileForm() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const { data: session } = authClient.useSession();
    const { data: user, isLoading } = useUser(session?.user?.id);
    const router = useRouter();
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

    // Avatar handling functions
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            validateImage(file);

            setAvatarFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const onSubmit = async (updatedUser) => {
        setErrorMessages([]);
        try {
            let imageUrl = null;
            if (avatarFile) {
                // Delete old avatar if exists
                if (user?.image) {
                    await deleteAvatarAction(user.image);
                }
                // Upload new avatar
                const formData = new FormData();
                formData.append('file', avatarFile);
                formData.append('userId', session?.user?.id);
                imageUrl = await uploadProfileImageAction(formData);
            }

            const { data, error } = await authClient.updateUser({
                name: updatedUser.name,
                phoneNumber: updatedUser.phoneNumber,
                address: updatedUser.address,
                ...(imageUrl && { image: imageUrl }),
            });
            if (error) {
                const normalizedError = error?.message?.toLowerCase();
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
            reset({
                name: data?.name,
                phoneNumber: data?.phoneNumber,
                address: data?.address,
            });
            setAvatarFile(null);
            setAvatarPreview(null);
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

                    {/* Avatar Upload Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile Picture <span className="text-gray-500 font-normal">(optional)</span>
                        </label>

                        {/* Avatar Preview */}
                        {avatarPreview && (
                            <div className="mb-4 flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-20 h-20 rounded-full object-cover border-4 border-green-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        title="Remove avatar"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Selected: {avatarFile?.name}</p>
                                    <p>Size: {(avatarFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        )}

                        {/* Upload Area - Hidden when avatar is selected */}
                        {!avatarPreview && (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple={false}
                                    onChange={handleAvatarChange}
                                    disabled={isSubmitting}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-gray-300 bg-gray-50 hover:bg-gray-100 ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                            Your profile picture will be visible to other users and helps personalize your account.
                        </div>
                    </div>

                    <input type="submit"
                        disabled={isSubmitting || !isValid || (!isDirty && !avatarFile)}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSubmitting || !isValid || (!isDirty && !avatarFile)
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
