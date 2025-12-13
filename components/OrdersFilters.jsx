'use client';

import { useForm } from "react-hook-form";
import { Form, FormInput } from "./UX";
import FormSelect from "./UX/FormSelect";
import { OrdersFiltersContext } from "@/context/OrdersFiltersContext";
import { useContext } from "react";

export default function OrdersFilters() {
    const form = useForm({
        defaultValues: {
            searchQuery: '',
            status: 'all',
            startDate: null,
            endDate: null,
        }
    });
    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
        { value: "returned", label: "Returned" },
        { value: "all", label: "All" },
    ];
    const { setFilters } = useContext(OrdersFiltersContext);
    const onSubmit = (data) => {
        setFilters(data);
    }
    return (
        <section className="bg-white p-4 rounded-lg mb-6">
            <Form form={form} onSubmit={form.handleSubmit(onSubmit)} title="Search and Filter Orders" showHeader>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormInput
                        name="searchQuery"
                        label='Search Orders'
                        type="search"
                        placeholder="Search by order ID or customer..."
                    />
                    <FormSelect
                        name="status"
                        label='Order Status'
                        options={statusOptions}
                    />
                    <FormInput
                        name="startDate"
                        label='Order Start Date'
                        type="date"
                    />
                    <FormInput
                        name="endDate"
                        label='Order End Date'
                        type="date"
                    />
                </div>
                <div className="mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Apply Filters</button>
                </div>
            </Form>
        </section>
    );
}
