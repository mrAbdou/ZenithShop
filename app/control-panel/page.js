import ControlPanelForm from "../../components/ControlPanelForm";
export const metadata = {
    title: "Control Panel",
    description: "Control Panel",
}
export default function ControlPanelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            {/* Container الرئيسي */}
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header مع gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <svg
                                className="w-10 h-10 text-blue-600"
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
                        <h1 className="text-3xl font-bold text-white mb-2">Control Panel</h1>
                        <p className="text-blue-100 text-sm">Admin Access Only</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <ControlPanelForm />
                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-xs text-amber-800">
                                    <strong className="font-semibold">Security Notice:</strong> This area is restricted to authorized personnel only. All access attempts are logged and monitored.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    © 2025 E-Commerce Platform. All rights reserved.
                </p>
            </div>
        </div>
    );
}
