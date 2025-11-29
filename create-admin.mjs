// Script to create an admin user using Better Auth's signUp API, then promote to admin
import { createAuthClient } from "better-auth/client";
import prisma from './lib/prisma.js';
import { date } from "zod";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});


// Note: Better Auth signUp doesn't support custom fields like role, phoneNumber, address
// So we create the user via Better Auth API, then update the role

async function createAdminUser(email = 'admin@yourapp.com', password = 'secureAdminPass123') {
  try {
    console.log('Creating admin user via Better Auth signUp...');

    // 1. Use Better Auth's signUp API to create the user
    const { data, error } = await authClient.signUp.email({
      name: "Admin User",
      phoneNumber: "+1234567890",
      address: "Admin Headquarters",
      emailVerified: new Date("2025-11-29T21:36:30.421Z"),
      email: email,
      password: password,
      // callbackURL is optional for redirect after signup
    });

    if (error) {
      console.error('❌ Better Auth signUp failed:', error);
      throw new Error(`SignUp failed: ${error.message || error}`);
    }

    console.log('✅ User created successfully via Better Auth');

    // 2. Update the user record to set role to ADMIN
    // Better Auth signUp doesn't support custom fields, so we update separately
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: 'ADMIN',
        phoneNumber: '+1234567890', // Add admin contact info
        address: 'Admin Headquarters',
      },
    });

    console.log('✅ Admin role and details updated successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ADMIN`);
    console.log(`SignUp Response:`, data);

    return { user: updatedUser, signUpData: data };
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

// Export for use in other files if needed
export { createAdminUser };
