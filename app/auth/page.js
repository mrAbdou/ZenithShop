import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CheckoutAuth from "@/components/customer/CheckoutAuth";
import { Role } from "@prisma/client";
import { getLocale, getTranslations } from "@/lib/i18n/server";

export async function generateMetadata() {
    const locale = await getLocale();
    const authTranslations = await getTranslations('auth');
    
    return {
        title: authTranslations.pageTitle || "Sign In | ZenithShop",
        description: authTranslations.pageDescription || "Sign in to your account or create a new one",
    };
}
export default async function AuthenticationPage({ searchParams }) {
    const h = await headers();
    const session = await auth.api.getSession({
        headers: h,
    });
    const { redirectTo } = await searchParams;
    const redirectPath = decodeURIComponent(redirectTo || '/customer-dashboard');
    const authTranslations = await getTranslations('auth');

    if (session && session.user.role === Role.CUSTOMER) {
        redirect(redirectPath);
    } else if (session && session.user.role === Role.ADMIN) {
        redirect('/control-panel');
    } else {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{authTranslations.welcomeBack}</h1>
                        <p className="text-gray-600">{authTranslations.welcomeMessage}</p>
                    </div>
                    <CheckoutAuth redirectTo={redirectPath} />
                </div>
            </div>
        );
    }
}
