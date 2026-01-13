'use client';
import { useForm } from "react-hook-form";
import { SignUpCustomerSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ZodValidationError from "@/lib/ZodValidationError";
import { supabase, validateImage } from "@/lib/supabase";
import { uploadProfileImageAction } from "@/app/actions/upload";
import { updateUserImage } from "@/services/users.client";
export default function SignUpCustomers({ redirectPath }) {
    const [errorMessages, setErrorMessages] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const router = useRouter();
    // form configuration :
    const { register, handleSubmit, formState: { errors, isSubmitting, isValid, isDirty }, reset } = useForm({
        resolver: zodResolver(SignUpCustomerSchema),
        mode: 'onChange'
    });

    // Avatar handling functions
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            validateImage(file);
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    //submit function :
    const onSubmit = async ({ name, email, password, phoneNumber, address }) => {
        setErrorMessages([]); // clear the error messages
        try {
            // Create the account first
            const { data, error } = await authClient.signUp.email({ name, email, password, phoneNumber, address });
            if (error) {
                const mappedErrors = [];
                const normalizedError = error?.message?.toLowerCase();
                // Allow multiple error types to be detected and displayed
                if (normalizedError.includes('email')) {
                    mappedErrors.push({ field: 'email', message: error.message });
                } else if (normalizedError.includes('password')) {
                    mappedErrors.push({ field: 'password', message: error.message });
                } else if (normalizedError.includes('name')) {
                    mappedErrors.push({ field: 'name', message: error.message });
                } else {
                    mappedErrors.push({ field: 'form', message: error.message });
                }
                setErrorMessages(mappedErrors);
                return;
            }

            // If avatar was selected, upload it and update user profile
            if (avatarFile && data?.user?.id) {
                try {
                    const formData = new FormData();
                    formData.append('file', avatarFile);
                    formData.append('userId', data.user.id);

                    const avatarUrl = await uploadProfileImageAction(formData);

                    if (avatarUrl) {
                        await updateUserImage({ imageUrl: avatarUrl });
                    }
                } catch (avatarError) {
                    // Avatar upload failed, but account was created successfully
                    console.error('Avatar upload failed:', avatarError);
                    toast.error('Account created but profile picture upload failed. You can update it later.');
                }
            }

            toast.success('Account created successfully!');
            router.push(redirectPath);

        } catch (error) {
            if (error instanceof ZodValidationError) {
                setErrorMessages(error.issues);
                return;
            }
            toast.error('Unexpected error occurred. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Messages Display */}
            {errorMessages.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Errors</h3>
                    <div className="space-y-1">
                        {errorMessages.map((error, index) => (
                            <p key={index} className="text-sm text-red-700 font-medium">
                                {error.field === 'form' ? error.message : `${error.field}: ${error.message}`}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Name Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        {...register("name")}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="Enter your full name"
                    />
                </div>
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.name.message}</p>
                )}
            </div>

            {/* Email Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <input
                        type="email"
                        {...register("email")}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            } ${(isSubmitting) ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="your@email.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        type="password"
                        {...register("password")}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="Create a strong password"
                    />
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
            </div>

            {/* Phone Number Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        {...register("phoneNumber")}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
                {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.phoneNumber.message}</p>
                )}
            </div>

            {/* Address Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shipping Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        {...register("address")}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="123 Main St, City, State"
                    />
                </div>
                {errors.address && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.address.message}</p>
                )}
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

            {/* Submit Button */}
            <button
                disabled={isSubmitting || !isValid || !isDirty}
                type="submit"
                className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 ${(isSubmitting || !isValid || !isDirty) ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Create Account
            </button>
        </form>
    );
}
