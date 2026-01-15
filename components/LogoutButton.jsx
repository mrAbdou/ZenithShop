"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n/context";

export default function LogoutButton() {
    const router = useRouter();
    const { t } = useTranslation();
    const disconnectFromSession = () => {
        authClient.signOut().then(() => {
            router.push('/');
        }).catch((e) => {
            toast.error(`${t('messages.logoutFailed')}: ${e.message || t('messages.pleaseTryAgain')}`);
        });
    }
    return (
        <button
            onClick={disconnectFromSession}
            className="group relative inline-flex items-center px-4 py-2 bg-linear-to-r from-red-500 via-red-600 to-pink-500 hover:from-red-600 hover:via-red-700 hover:to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50"
            aria-label={t('navigation.logout')}
        >
            <svg
                className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
            <span className="mx-2">{t('navigation.logout')}</span>
        </button>
    )
}
