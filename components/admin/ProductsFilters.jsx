'use client';

import { useForm } from "react-hook-form";
import Form from "@/components/UX/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFilterSchema } from "@/lib/zodSchemas";
import FormSelect from "@/components/UX/FormSelect";
import { FormInput } from "@/components/UX";
import { useProductContext } from "@/context/ProductContext";

export default function ProductsFilters() {
    const { setFilteringProps } = useProductContext();
    const form = useForm({
        defaultValues: {
            searchQuery: '',
            stock: '',
            startDate: null,
            endDate: null,
        },
        resolver: zodResolver(ProductFilterSchema),
        mode: 'onChange',
    });
    const onSubmit = (data) => {
        setFilteringProps(data);
    }
    return (
        <section className="bg-white p-4 rounded-lg mb-6">
            <Form form={form} onSubmit={form.handleSubmit(onSubmit)} title="Search and Filter Products" showHeader>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormInput
                        name="searchQuery"
                        label='Search Products'
                        type="text"
                        placeholder="Search by name or ID..."
                    />
                    <FormSelect
                        name="stock"
                        label='Stock Status'
                        options={[
                            { value: '', label: 'All' },
                            { value: 'In Stock', label: 'In Stock' },
                            { value: 'Low Stock', label: 'Low Stock' },
                            { value: 'Out Stock', label: 'Out of Stock' },
                        ]}
                    />
                    <FormInput
                        name="startDate"
                        label='From Date'
                        type="datetime-local"
                    />
                    <FormInput
                        name="endDate"
                        label='To Date'
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
