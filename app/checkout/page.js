import CheckoutCartResume from "@/components/CheckoutCartResume";
import SignUpCustomers from "@/components/SignUpCustomers";
export const metadata = {
  title: "Checkout",
  description: "Checkout",
}
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Please review your order and complete registration</p>
        </div>

        {/* Grid Layout: Cart Left, Registration Right */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="order-1 lg:order-1">
            <CheckoutCartResume />
          </div>

          <div className="order-2 lg:order-2 space-y-6">
            <SignUpCustomers />
          </div>
        </div>
      </div>
    </div>
  );
}
