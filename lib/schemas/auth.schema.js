import { z } from 'zod';

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