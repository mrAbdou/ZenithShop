import { z } from "zod";

export const OrderItemSchema = z.object({
    productId: z
        .string('Product ID must be a string')
        .min(24, 'Product ID must be a valid string'),
    qte: z.preprocess(value => {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }, z.number('Quantity is required as number')
        .int('Quantity must be an integer')
        .positive('Quantity must be greater than 0'))
});