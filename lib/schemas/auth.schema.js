import { z } from 'zod';

export const SignUpCustomerSchema = z.object({
    name: z.string('Name is required')
        .min(3, "Name must be at least 3 characters long")
        .max(150, "Name must be less than 150 characters")
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z\s]+$/, "Name must contain only letters and spaces"),
    email: z.string('Email is required').email("Invalid email address"),
    password: z
        .string('Password is required')
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    phoneNumber: z.string('Phone number is required')
        .regex(/^(\+213[0-9]{9}|[0-9]{10})$/, "Phone number must be 10 digits or +213 followed by 9 digits")
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')), // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
    address: z.string('Address is required')
        .min(10, "Address must be at least 10 characters long")
        .max(500, "Address must be less than 500 characters")
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s,\.\-\(\)\/\\]+$/, "Address contains invalid characters"),
});

export const SignInCustomerSchema = z.object({
    email: z
        .string('Email is required')
        .email("Invalid email address"),
    password: z
        .string('Password is required')
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

});
