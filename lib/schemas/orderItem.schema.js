import { z } from "zod";

export const OrderItemSchema = z.object({
    productId: z
        .string('Product ID is required'), // Match Prisma string type
    qte: z
        .number('Quantity is required')
        .int('Quantity must be an integer')
        .positive('Quantity must be greater than 0')
});