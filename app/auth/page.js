import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CheckoutAuth from "@/components/customer/CheckoutAuth";
import { Role } from "@prisma/client";
export const metadata = {
    title: "Sign In | ZenithShop",
    description: "Sign in to your account or create a new one",
};
export default async function AuthenticationPage({ searchParams }) {
    const h = await headers();
    const session = await auth.api.getSession({
        headers: h,
    });
    const { redirectTo } = await searchParams;
    const redirectPath = decodeURIComponent(redirectTo || '/customer-dashboard');
    if (!session) {
        // No session, show auth form
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account or create a new one</p>
                    </div>
                    <CheckoutAuth redirectTo={redirectTo} />
                </div>
            </div>
        );
        //there is a session and the role is admin, take it to control-panel/dashboard
    } else if (session.user.role === Role.ADMIN) {
        redirect('/control-panel/dashboard');
    } else {
        //there is a session and the role is customer, take it to customer-dashboard
        redirect(redirectPath);
    }
}
