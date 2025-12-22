import { z } from "zod";

export const UpdateCustomerSchema = z.object({
    name: z
        .string('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must be at most 50 characters long')
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z\s]+$/, "Name must contain only letters and spaces")
        .optional(),
    //you can't update email, this is a protected field and a key field for the account.
    //password update should be done through better auth functions not here.
    phoneNumber: z.string('Phone number is required')
        .regex(/^(\+213[0-9]{9}|[0-9]{10})$/, "Phone number must be 10 digits or +213 followed by 9 digits")
        .transform((val) => val.replace(/[\s\-\(\)]/g, '')) // Remove formatting like 0556-666666 or (0556)666666 to become 0556666666
        .optional(),
    address: z
        .string('Address is required')
        .min(10, "Address must be at least 10 characters long")
        .max(500, "Address must be less than 500 characters")
        .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u00C0-\u00FF\u0100-\u017Fa-zA-Z0-9\s,\.\-\(\)\/\\]+$/, "Address contains invalid characters")
        .optional()
});
