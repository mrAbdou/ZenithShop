import { z } from "zod";

export const UpdateCustomerSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional()
});