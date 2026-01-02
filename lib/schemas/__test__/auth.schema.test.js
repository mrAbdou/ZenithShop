import { describe, expect, it } from "vitest";
import { SignInCustomerSchema, SignUpCustomerSchema } from "../auth.schema";
import { maxLengthAddress, maxLengthUserName, minPasswordLength } from "@/lib/constants";
describe("Authentication Schema Tests", () => {
    describe("Sign Up Customer Schema Tests", () => {
        describe('Name Field', () => {
            it('should validate invalid for signing up without providing a name', () => {
                const result = SignUpCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: 'password',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name is required');
            })
            it('should validate invalid for signing up with a short name', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'Jo',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name must be at least 3 characters long');
            });
            it('should validate invalid for signing up with a name containing numbers', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe 123 ',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name must contain only letters and spaces');
            });
            it('should validate invalid for signing up with a name containing special characters', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe @',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Name must contain only letters and spaces');
            });
            it('should validate invalid for signing up with a too long name', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'this is too long that that should not pass the validation using SignUpCustomerSchema because the muximum length of name is up to 150 character but this is way too long than that, and should failed during validation, that is wonderfull to have something like that to avoid any attack through text fields',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe(`Name must be less than ${maxLengthUserName} characters long`);
            });
            it('should validate valid for signing up with arabic names', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'عبد السلام برهان الدين بوبيدي',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(true);
            });
            it('should validate valid for signing up with french names', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'Émile Dupont',
                    email: 'emile.dupont@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(true);
            });
            it('should validate valid for mixed name between arabic and french', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'عبد السلام برهان الدين بوبيدي Émile Dupont',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(true);
            })
        });
        describe('Email Field', () => {
            it('should validate invalid for signing up without providing email address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Email is required');
            })
            it('should validate invalid for signing up with wrong email address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe',
                    password: 'password',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Invalid email address');
            });
        });
        describe('Password Field', () => {
            it('should validate invalid for signing up without providing password', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password is required');
            })
            it('should validate invalid for signing up with a short password', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'pass',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe(`Password must be at least ${minPasswordLength} characters long`);
            });
            it('should validate invalid for signing ip with password that has only lower cases', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'password',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
            it('should validate invalid for signing up with password that has only upper cases', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'PASSWORD',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
            it('should validate invalid for signing up with password that has only numbers', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: '12345678',
                    phoneNumber: '1234567890',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
        })
        describe('Phone Number Field', () => {
            it('should validate invalid for signin up without a phone number', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Phone number is required');
            })
            it('should validate invalid for signing up with wrong phone number', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '123abc',
                    address: 'some random address'
                })
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
            });
            it('should validate invalid for signing up with wrong phone number 2', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '+123456789',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
            });
            it('should validate invalid for signing up with wrong phone number 3', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890112',
                    address: 'some random address'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Phone number must be 10 digits or +213 followed by 9 digits');
            });
            it('should validate valid for signing up with correct phone number with country code', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '+213456789011',
                    address: 'some random address'
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for signing up with correct phone number without country code', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '0556174870',
                    address: 'some random address'
                });
                expect(result.success).toBe(true);
            });
        })
        describe('Address Field', () => {
            it('should validate invalid for signing up without providing an address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Address is required');
            });
            it('should validate invalid for signing up with too short address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'so'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Address must be at least 10 characters long');
            });
            it('should validate invalid for signing up with too long address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'a'.repeat(501)
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe(`Address must be less than ${maxLengthAddress} characters long`);
            });
            it('should validate valid for signing up with an arabic typed address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'حي الحياة و حي المنى في قسنطينة'
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for signing up with an french typed address', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: 'rouge à lèvres géniaux'
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid for signing up with an mixed text arabic and numbers and ponctuations', () => {
                const result = SignUpCustomerSchema.safeParse({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'P@ssw0rd',
                    phoneNumber: '1234567890',
                    address: "123 شارع الحرية، الجزائر 16000"
                });
                expect(result.success).toBe(true);
            });

        });

        it('should validate valid for correct data', () => {
            const result = SignUpCustomerSchema.safeParse({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'P@ssw0rd',
                phoneNumber: '1234567890',
                address: 'some random address'
            });
            expect(result.success).toBe(true);
        });

    });
    describe("Sign In Customer Schema Tests", () => {
        it('should validate valid for correct data', () => {
            const result = SignInCustomerSchema.safeParse({
                email: 'johndoe@example.com',
                password: 'P@ssw0rd'
            });
            expect(result.success).toBe(true);
        })
        describe('Password Field', () => {
            it('should validate invalid for sign in without password', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password is required');
            });
            it('should validate invalid for sign in with wrong password', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: 'wrong password'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
            it('should validate invalid for sign in with too short password', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: 'P@ss'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe(`Password must be at least ${minPasswordLength} characters long`);
            });
            it('should validate invalid with password contains only lower cases', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: 'password'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
            it('should validate invalid with password contains only upper cases', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: 'PASSWORD'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
            it('should validate invalid with password contains only numbers', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe@example.com',
                    password: '12345678'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            });
        });
        describe('Email Field', () => {
            it('should validate invalid for sign in without email', () => {
                const result = SignInCustomerSchema.safeParse({
                    password: 'P@ssw0rd'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Email is required');
            });
            it('should validate invalid for sign in with wrong email', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'johndoe.example@com',
                    password: 'P@ssw0rd'
                });
                expect(result.success).toBe(false);
                expect(result.error.issues[0].message).toBe('Invalid email address');
            });
            it('should validate valid with complex email formats 01', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'test+label@example.com',
                    password: 'P@ssw0rd'
                });
                expect(result.success).toBe(true);
            });
            it('should validate valid with complex email formats 02', () => {
                const result = SignInCustomerSchema.safeParse({
                    email: 'user@subdomain.example.com',
                    password: 'P@ssw0rd'
                });
                expect(result.success).toBe(true);
            });
        })
    });
});