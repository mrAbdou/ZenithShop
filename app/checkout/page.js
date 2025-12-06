import CheckoutAuth from "@/components/CheckoutAuth";
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

        {/* Account Requirement Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Account Required for Checkout</h3>
              <p className="text-sm text-yellow-700 mt-1">Please sign in to your existing account or create a new one to complete your order successfully.</p>
            </div>
          </div>
        </div>

        <CheckoutAuth />
      </div>
    </div>
  );
}
