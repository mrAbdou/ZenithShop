'use client';
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import SignInCustomers from "@/components/SignInCustomers";
import SignUpCustomers from "@/components/SignUpCustomers";
import { redirect } from "next/navigation";

export default function CheckoutAuth({ redirectTo }) {
    const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
    const [loading, setLoading] = useState(true);
    const redirectPath = redirectTo ? decodeURIComponent(redirectTo) : '/customer-dashboard';
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: session } = await authClient.getSession();
            if (!session) {
                setIsAuthenticated(false);
                setLoading(false);
            } else {
                setIsAuthenticated(true);
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 text-center">
                    <div className="mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Checking Your Session</h3>
                        <p className="text-sm text-gray-600">Please wait while we verify your account...</p>
                    </div>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    //could be removed, there is no need of it in here because of the redirection to the customer page 
    if (isAuthenticated) {
        redirect(redirectPath);
    }

    return (
        <div className="max-w-md mx-auto">
            {/* Auth Toggle Segment */}
            <div className="flex p-2 bg-gray-100 rounded-xl mb-6 shadow-sm">
                {/* Sign In Toggle Button */}
                <button
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${authMode === 'signin'
                        ? 'bg-white text-green-700 border-2 border-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setAuthMode('signin')}
                >
                    Sign In
                </button>

                {/* Create Account Toggle Button */}
                <button
                    className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${authMode === 'signup'
                        ? 'bg-white text-green-700 border-2 border-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setAuthMode('signup')}
                >
                    Create Account
                </button>
            </div>

            {/* Forms Container */}
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 min-h-[450px]">
                {/* Sign In Form */}
                <div className={`transition-all duration-300 ${authMode === 'signin' ? 'block' : 'hidden'}`}>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sign In to Your Account</h3>
                        <p className="text-sm text-gray-600">Welcome back! Sign in to complete your order.</p>
                    </div>
                    <SignInCustomers redirectTo={redirectTo} />
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            New customer?{' '}
                            <button
                                className="text-green-600 font-semibold hover:underline transition-colors"
                                onClick={() => setAuthMode('signup')}
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>

                {/* Sign Up Form */}
                <div className={`transition-all duration-300 ${authMode === 'signup' ? 'block' : 'hidden'}`}>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your Account</h3>
                        <p className="text-sm text-gray-600">Join us! Create an account to complete your first order.</p>
                    </div>
                    <SignUpCustomers redirectTo={redirectTo} />
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                className="text-green-600 font-semibold hover:underline transition-colors"
                                onClick={() => setAuthMode('signin')}
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Loading State (when checking auth) */}
                <div className={`transition-all duration-300 ${loading ? 'block' : 'hidden'} max-w-md mx-auto`}>
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-14 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Authenticated State (for existing users) */}
                <div className={`transition-all duration-300 ${isAuthenticated ? 'block' : 'hidden'} text-center py-12`}>
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">You're Signed In!</h3>
                        <p className="text-sm text-gray-600">Proceed to complete your order.</p>
                    </div>
                    {/* Placeholder for OrderCompletion component */}
                </div>
            </div>
        </div>
    );
}
