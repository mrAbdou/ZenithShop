import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma),
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    // Add providers like Google, GitHub, etc.
    // google: { clientId: "...", clientSecret: "..." },
  },
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
    // Optional: autoSignIn: true,
  },
  // Add other configurations as needed
});
