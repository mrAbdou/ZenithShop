import z from "zod";

// =============================================
// EXISTING FORM SCHEMAS
// =============================================

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

export const SignUpCustomerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
    address: z.string().min(10, "Address must be at least 10 characters long"),
});

export const SignInCustomerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// =============================================
// NEW DATA SCHEMA DEFINITIONS (COMPREHENSIVE VALIDATION)
// =============================================

// Helper for decimal numbers (handles strings/floats)
const decimalSchema = z.preprocess(
    (val) => val === '' || val === undefined || val === null ? undefined : Number(val),
    z.number().positive()
);

// User schemas
export const UserSchema = z.object({
    id: z.string(), // CUID - validated as string only
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(['CUSTOMER', 'ADMIN']),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export const CreateUserSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string().optional(),
    address: z.string().optional()
});

export const UpdateCustomerSchema = z.object({
    // no id because the user under update must be signed in so i can get his id from the session
    email: z.string().email(),
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional()
});

// Product schemas
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    price: decimalSchema,
    qteInStock: z.number().int().min(0)
});

export const CreateProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: decimalSchema,
    qteInStock: z.number().int().min(0)
});

// Order schemas
export const OrderItemSchema = z.object({
    productId: z.string(), // Match Prisma string type
    qte: z.number().int().positive()
});

export const OrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    total: decimalSchema,
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
    items: z.array(OrderItemSchema)
});

export const CreateOrderSchema = z.object({
    total: decimalSchema,
    items: z.array(OrderItemSchema).min(1)
});

// =============================================
// VALIDATION UTILITY FUNCTIONS
// =============================================

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

