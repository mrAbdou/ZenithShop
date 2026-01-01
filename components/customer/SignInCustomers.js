'use client';
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { SignInCustomerSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function SignInCustomers({ redirectPath }) {
    const { getCart } = useContext(CartContext);
    const cart = getCart();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(SignInCustomerSchema),
        mode: 'onChange'
    });


    const onSubmit = async ({ email, password }) => {
        const { data, error } = await authClient.signIn.email({ email, password });
        if (error) {
            toast.error(`${error.message}`);
            return;
        }

        if (data) {
            toast.success('Signed in successfully!');
            router.push(redirectPath);
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        {...register('email')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
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
                        {...register('password')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
                        placeholder="Enter your password"
                    />
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
            </button>
        </form>
    )
}
