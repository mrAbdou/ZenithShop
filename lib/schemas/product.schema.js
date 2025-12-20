import { z } from "zod";
//Tested and passed 100%
export const AddProductSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().optional(),
    price: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().min(0, "Price must be a positive number")),
    qteInStock: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return parseInt(val);
    }, z.number().int().min(0, "Qte in stock must be a positive number"))
})
//Tested and passed 100%
export const UpdateProductSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters").optional(),
    description: z.string().optional(),
    price: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().min(0)).optional(),
    qteInStock: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().int().min(0)).optional()
});
//Tested and passed 100%
export const ProductPaginationSchema = z.object({
    //filtering props
    searchQuery: z.string().optional(),
    stock: z.enum(['', 'In Stock', 'Low Stock', 'Out Stock']).optional(),
    startDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    endDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    //sorting props
    //this enum is defined to match what the CSR component table has offers to sort by
    sortBy: z.enum(['', 'id', 'name', 'price', 'stock', 'createdAt']).nullable().optional(),
    sortDirection: z.enum(['', 'asc', 'desc']).nullable().optional(),
    //pagination props
    limit: z.number().min(5).max(50).optional(),
    currentPage: z.number().min(1).optional(),
}).refine(data => {
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
        return false;
    }
    return true;
});
//Tested and passed 100%
export const InfiniteProductSchema = z.object({
    limit: z.number().int().min(5).max(50),
    offset: z.number().int().min(0),
})