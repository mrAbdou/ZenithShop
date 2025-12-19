import z from "zod";
const decimalSchema = z.preprocess(
    (val) => val === '' || val === undefined || val === null ? undefined : Number(val),
    z.number().positive()
);

// =============================================
// ORDER ITEM validation schemas (CRUD operations)
// =============================================

export const OrderItemSchema = z.object({
    productId: z.string(), // Match Prisma string type
    qte: z.number().int().positive()
});


// =============================================//
// PRODUCT validation schemas (CRUD operations) //
// =============================================//

export const AddProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().min(0)),
    qteInStock: z.preprocess((val) => {
        if (val === '' || val === undefined || val === null) return undefined;
        return Number(val);
    }, z.number().int().min(0))
})
export const UpdateProductSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters").optional(),
    description: z.string().optional(),
    price: decimalSchema.optional(),
    qteInStock: decimalSchema.optional()
});
export const ProductFilterSchema = z.object({
    searchQuery: z.string().optional(),
    stock: z.enum(['', 'In Stock', 'Low Stock', 'Out Stock']).optional(),
    startDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    endDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
})
    .refine(data => {
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            return false;
        }
        return true;
    })

// =============================================//
// ORDER validation schemas (CRUD operations)   //
// =============================================//

export const CreateOrderSchema = z.object({
    total: decimalSchema,
    items: z.array(OrderItemSchema).min(1)
});

export const updateOrderSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
});

export const OrderFilterSchema = z.object({
    //filtering props
    searchQuery: z.string().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']).optional(),
    startDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    endDate: z.preprocess(value => (value && value !== "") ? new Date(value) : undefined, z.date().optional()),
    //sorting props
    sortBy: z.string().nullable().optional(),
    sortDirection: z.enum(['asc', 'desc']).nullable().optional(),
    //pagination props
    currentPage: z.number().optional(),
    limit: z.number().optional(),
    totalPages: z.number().optional(),
})
    .refine((data) => {
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            return false;
        }
        return true;
    }, {
        message: "End date cannot be before start date",
        path: ["endDate"],
    });

// =============================================
// AUTH validation schemas (sign in / sign up)
// =============================================

export const SignUpCustomerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phoneNumber: z.string().min(10),
    address: z.string().min(10),
});

export const SignInCustomerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// =============================================
// CUSTOMER validation schemas (CRUD operations)
// =============================================

export const UpdateCustomerSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional()
});





/**
 * Validates data against schema, throws on error
 */
export function validateData(schema, data) {
    return schema.parse(data);
}

/**
 * Safely validates data, returns result object
 */
export function safeValidate(schema, data) {
    return schema.safeParse(data);
}

/**
 * Async validation for complex schemas
 */
export async function validateDataAsync(schema, data) {
    return schema.parseAsync(data);
}
