/**
 * Prisma Client Singleton — src/lib/db.ts
 *
 * Prisma v7 requires passing an adapter to PrismaClient.
 * The adapter handles the actual database connection.
 * We use @prisma/adapter-pg which connects via the `pg` library.
 *
 * WHY A SINGLETON?
 *   Prisma Client maintains a connection pool to PostgreSQL.
 *   In Next.js dev mode, every file save hot-reloads the server module graph.
 *   Without this pattern, each hot-reload creates a NEW connection pool,
 *   exhausting your database's connection limit within minutes.
 *
 * HOW IT WORKS:
 *   - In production (NODE_ENV=production): one instance, created once.
 *   - In development: the instance is stored on `globalThis` (the Node.js
 *     global object). Module hot-reload clears module cache but NOT globalThis,
 *     so we reuse the existing client instead of creating a new one.
 *
 * USAGE — import this everywhere you need database access:
 *   import { db } from '@/lib/db'
 *   const trades = await db.trade.findMany({ where: { userId: '...' } })
 *
 * NEVER import this in Client Components.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]  // log SQL queries in dev — see them in terminal!
        : ["error"],
  });
}

// Extend globalThis with a typed prisma property.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
