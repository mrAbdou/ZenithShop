'use client';

import { useOrder, useUpdateOrder } from "@/hooks/orders";
import { updateOrderSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../UX";
import FormSelect from "../UX/FormSelect";
import { OrderStatus } from "@/lib/constants";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function UpdateOrderForm({ id }) {
    const router = useRouter();
    const { data: order } = useOrder(id);
    const form = useForm({
        defaultValues: {
            status: order?.status,
        },
        resolver: zodResolver(updateOrderSchema),
        mode: "onChange",
    });
    useEffect(() => {
        form.reset({
            status: order?.status,
        });
    }, [order]);
    const { mutateAsync: updateOrderAsync } = useUpdateOrder(id);
    const onSubmit = async (data) => {
        await updateOrderAsync(data, {
            onSuccess: (data) => {
                form.reset();
                toast.success("Order updated successfully");
                router.push('/control-panel/orders');
            },
            onError: (error) => {
                toast.error(error.message ?? 'Failed to update order');
            }
        });
    };
    const orderStatusOptions = [
        { value: OrderStatus.PENDING, label: "Pending" },
        { value: OrderStatus.CONFIRMED, label: "Confirmed" },
        { value: OrderStatus.SHIPPED, label: "Shipped" },
        { value: OrderStatus.DELIVERED, label: "Delivered" },
        { value: OrderStatus.CANCELLED, label: "Cancelled" },
        { value: OrderStatus.RETURNED, label: "Returned" },
    ];
    return (
        <Form
            form={form}
            onSubmit={onSubmit}
            title={`Update Order ${order?.id?.slice(-8)}`}
            description="Change the order status to update its processing stage"
            showHeader={true}
            headerIcon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            }
        >
            <FormSelect name="status" label="Order Status" options={orderStatusOptions} />
            <div className="flex justify-end pt-6">
                <button
                    type='submit'
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Order
                </button>
            </div>
        </Form>
    )
}