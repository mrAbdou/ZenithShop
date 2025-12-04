import z from "zod";
export const AddProductSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long"),
    description: z
        .string()
        .optional(),
    price: z
        .preprocess((val) => {
            // Convert string numbers to actual numbers
            if (val === '' || val === undefined || val === null) return undefined;
            return Number(val);
        }, z.number()
            .min(0, "Price must be at least 0")),
    qteInStock: z
        .preprocess((val) => {
            // Convert string numbers to actual numbers
            if (val === '' || val === undefined || val === null) return undefined;
            return Number(val);
        }, z.number()
            .int("Quantity must be a whole number")
            .min(0, "Quantity must be at least 0")),
})
