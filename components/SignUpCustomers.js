'use client';
import { useForm } from "react-hook-form";
import { SignUpCustomerSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCompleteSignUp } from "@/hooks/users";
export default function SignUpCustomers() {
    const { cart } = useContext(CartContext);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(SignUpCustomerSchema),
        mode: 'onChange'
    });
    const { mutateAsync: completeSignUpAsync } = useCompleteSignUp();
    const onSubmit = async ({ name, email, password, phoneNumber, address }) => {
        try {
            //better auth has to do her work first
            await authClient.signUp.email({ name, email, password });
            // i run update after better auth has done her work, to set my custom fields that i added to user model
            // Remove GraphQL introspection fields from cart items
            const cleanedCart = cart.map(item => ({
                id: item.id,
                price: item.price,
                qte: item.qte,
                name: item.name,
                description: item.description,
                qteInStock: item.qteInStock
            }));
            const result = await completeSignUpAsync({ phoneNumber, address, cart: cleanedCart });
            if (result.success) {
                reset();
                toast.success('Account created and order completed successfully!');
                // Redirect to customer dashboard after successful order
                router.push('/customer-dashboard');
            }
        } catch (error) {
            toast.error(`Sign up failed: ${error.message}`);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
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
                        {...register("password")}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}
                        placeholder="123 Main St, City, State"
                    />
                </div>
                {errors.address && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.address.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Create Account & Order
            </button>
        </form>
    );
}
