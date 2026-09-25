/**
 * prisma.config.ts — Prisma v7 configuration file
 *
 * BREAKING CHANGE in Prisma v7:
 *   - datasource.url moves here (out of schema.prisma)
 *   - migrations.seed moves here (out of package.json "prisma" field)
 *
 * Reference: https://pris.ly/d/config-datasource
 */

import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// Load .env then .env.local (later file wins on conflicts)
try { loadEnvFile(".env"); } catch {}
try { loadEnvFile(".env.local"); } catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env or .env.local");
}

export default defineConfig({
  datasource: { url },
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});
