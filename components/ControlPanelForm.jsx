"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // use client auth
// zod schema for form validation of admin login 
const schema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
});
export default function ControlPanelForm() {
    //errors returned from the better-auth/client package goes in here
    const [error, setError] = useState(null);
    /// react-hook-form setup for login admin form with zod validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const router = useRouter();
    const onSubmit = async (formData) => {
        try {
            // use the signIn with email password method from better-auth client
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setError(error.message || error.statusText || 'Login failed');
            } else {
                router.push("/control-panel/dashboard");
            }
        } catch (err) {
            setError(err?.message || 'An unexpected error occurred');
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {typeof error === 'string' ? error : (error?.message || String(error))}
                </p>
            )}
            {/* Email Field */}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    E-mail
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                >
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <input
                        {...register("password")}
                        placeholder="Enter your password"
                        id="password"
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    />
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <button
                disabled={Object.keys(errors).length > 0}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sign In
            </button>
        </form>

    )
}
