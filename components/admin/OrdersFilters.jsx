'use client';

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Form, FormInput } from "../UX";
import FormSelect from "../UX/FormSelect";
import { OrderStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderFilterSchema } from "@/lib/zodSchemas";
import { useOrderFiltersContext } from "@/context/OrdersFiltersContext";
// this component is used to filter orders
// it defines an object of conditions or filter values , that will be used to fetch orders from the server
// it also provides a form to update the filter values
// all filter values are shated between this component and OrdersTable.jsx component through OrdersFiltersContext
export default function OrdersFilters() {
    // i used RHF do define a form for filter values , this way i can validate the values using zod schema validation and returned in organized shape (object)
    //TODO: create a zod schema validation for filter values
    //TODO: include the created zod schema validation in useForm and set the mode to onChange
    const form = useForm({
        defaultValues: {
            searchQuery: '',
            status: OrderStatus.PENDING,
            startDate: null,
            endDate: null,
        },
        resolver: zodResolver(OrderFilterSchema),
        mode: 'onChange'
    });
    // all available order status options, that i defiend in the prisma schema
    const statusOptions = [
        { value: OrderStatus.PENDING, label: "Pending" },
        { value: OrderStatus.CONFIRMED, label: "Confirmed" },
        { value: OrderStatus.SHIPPED, label: "Shipped" },
        { value: OrderStatus.DELIVERED, label: "Delivered" },
        { value: OrderStatus.CANCELLED, label: "Cancelled" },
        { value: OrderStatus.RETURNED, label: "Returned" },
    ];
    // i get the function that it will set the filter values in the context
    const { updateFilters } = useOrderFiltersContext();

    // and here i call the updateFilters function to update the filter values in the context
    // this function is called when i click of apply filters button (submit the form)
    const onSubmit = (data) => {
        updateFilters(data);
    }

    // Watch date fields to trigger cross-field validation
    const watchedStart = form.watch('startDate');
    const watchedEnd = form.watch('endDate');
    useEffect(() => {
        if (watchedStart || watchedEnd) {
            form.trigger('endDate');
        }
    }, [watchedStart, watchedEnd, form]);

    return (
        <section className="bg-white p-4 rounded-lg mb-6">
            <Form form={form} onSubmit={form.handleSubmit(onSubmit)} title="Search and Filter Orders" showHeader>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormInput
                        name="searchQuery"
                        label='Search Orders'
                        type="text"
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
                        type="datetime-local"
                    />
                    <FormInput
                        name="endDate"
                        label='Order End Date'
                        type="datetime-local"
                    />
                </div>
                <div className="mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Apply Filters</button>
                </div>
            </Form>
        </section>
    );
}
