/**
 * prisma.config.ts — Prisma v7 configuration file
 *
 * BREAKING CHANGE in Prisma v7:
 *   The `url = env("DATABASE_URL")` in schema.prisma datasource block
 *   is no longer supported. The connection URL must be provided here.
 *
 * Reference: https://pris.ly/d/config-datasource
 */

import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
