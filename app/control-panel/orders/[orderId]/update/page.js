// start components import-----------------------------------------
import UpdateOrderForm from "@/components/admin/UpdateOrderForm";
// end components import-------------------------------------------

// better auth import --------------------------------------------
import { auth } from "@/lib/auth";
// end better auth import ------------------------------------------

// start services import -----------------------------------------
import { fetchOrder } from "@/services/orders.server";
// end services import -------------------------------------------

// start next import ---------------------------------------------
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
// end next import -----------------------------------------------

// start prisma import -------------------------------------------
import { Role, OrderStatus } from "@prisma/client";
// end prisma import ---------------------------------------------

export default async function UpdateOrder({ params }) {
    const { orderId } = await params;
    const h = await headers();
    const cookieHeader = h.get('cookie');
    const session = await auth.api.getSession({
        headers: h
    });
    if (!session || session.user.role !== Role.ADMIN) {
        return redirect('/');
    }
    const order = await fetchOrder({ id: orderId }, cookieHeader);
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
            {/* Header Section */}
            <div className="mb-12">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
                            <Link href={`/control-panel/orders/${orderId}`} className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Order Details
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Update Order
                            </h1>
                            <p className="text-blue-100 text-lg font-medium mb-4">
                                Modify order #{order.id.slice(-8)}
                            </p>
                            <p className="text-blue-50 max-w-2xl">
                                Update the order status to reflect the current processing stage. Changes will be tracked and visible across the system.
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-1">${order.total}</p>
                                    <p className="text-blue-100 text-sm">Order Total</p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-center">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UpdateOrderForm id={order?.id || orderId} />
        </div>
    );
}