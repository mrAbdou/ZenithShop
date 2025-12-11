import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CustomerCheckoutDashboard from "@/components/CustomerCheckoutDashboard";

export default async function CheckoutConfirmationPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "CUSTOMER") {
        redirect('/checkout')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <CustomerCheckoutDashboard />
        </div>
    );
}
