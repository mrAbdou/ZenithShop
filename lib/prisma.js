// lib/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

let prisma;

const connectionString = process.env.DATABASE_URL;

// Create pool and adapter (only when needed)
let adapter;

function getAdapter() {
  if (!adapter) {
    const pool = new Pool({ connectionString });
    adapter = new PrismaPg(pool);
  }
  return adapter;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter: getAdapter() });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: getAdapter() });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
