'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddProductSchema } from "@/lib/zodSchemas"; // correct
import { useAddProduct } from "@/hooks/products";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormTextArea from "./UX/FormTextArea";
import FormInput from "./UX/FormInput";
import Form from "./UX/Form";
export default function AddProductForm() {
    const router = useRouter();
    const { mutateAsync: addProductAsync } = useAddProduct();
    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            qteInStock: 0,
        },
        resolver: zodResolver(AddProductSchema),
        mode: "onChange",
    });
    const onSubmit = async (data) => {
        try {
            await addProductAsync(data);
            toast.success("Product added successfully");
            router.push("/control-panel/products");
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <Form
                title="Add New Product"
                description="Fill in the details below to add a product to your catalog"
                showHeader
                headerIcon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>}
                onSubmit={onSubmit}
                form={form}
            >
                <FormInput name="name" label="Product Name" type="text" placeholder="Enter product name" />
                <FormTextArea name="description" label="Description" placeholder="Describe your product" rows={4} />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput name="price" label="Price ($)" type="number" placeholder="0.00" step="0.01" min="0" />
                    <FormInput name="qteInStock" label="Quantity in Stock" type="number" placeholder="0" min="0" />
                </div>
                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <span className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Product
                        </span>
                    </button>
                </div>
            </Form>
        </div>
    )
}
