import { z } from "zod";

export const OrderItemSchema = z.object({
    productId: z.string(), // Match Prisma string type
    qte: z.number().int().positive()
});