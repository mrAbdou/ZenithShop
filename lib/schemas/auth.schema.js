import { z } from 'zod';
import { minLengthUserName, maxLengthUserName, userNameRegex, passwordRegex, minPasswordLength, phoneNumberRegex, minLengthAddress, maxLengthAddress, addressRegex } from '@/lib/constants';
export const SignInAdminSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z
        .string()
        .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
export const SignUpCustomerSchema = z.object({
    name: z.string('Name is required')
        .min(minLengthUserName, `Name must be at least ${minLengthUserName} characters long`)
        .max(maxLengthUserName, `Name must be less than ${maxLengthUserName} characters long`)
        .regex(userNameRegex, "Name must contain only letters and spaces"),
    email: z.string('Email is required').email("Invalid email address"),
    password: z
        .string('Password is required')
        .min(minPasswordLength, `Password must be at least ${minPasswordLength} characters long`)
        .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    phoneNumber: z.string('Phone number is required')
        .regex(phoneNumberRegex, "Phone number must be 10 digits or +213 followed by 9 digits")
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')), // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
    address: z.string('Address is required')
        .min(minLengthAddress, `Address must be at least ${minLengthAddress} characters long`)
        .max(maxLengthAddress, `Address must be less than ${maxLengthAddress} characters long`)
        .regex(addressRegex, "Address contains invalid characters"),
});

export const SignInCustomerSchema = z.object({
    email: z
        .string('Email is required')
        .email("Invalid email address"),
    password: z
        .string('Password is required')
        .min(minPasswordLength, `Password must be at least ${minPasswordLength} characters long`)
        .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

});
