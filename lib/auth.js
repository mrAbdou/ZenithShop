import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, { usePlural: false }),
  secret: process.env.BETTER_AUTH_SECRET || "P@s5w0rd",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    // Optional: autoSignIn: true,
  },
  // Add other configurations as needed
});
