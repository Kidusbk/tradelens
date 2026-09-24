/**
 * Data Layer — src/lib/data.ts
 *
 * Day 3 update: Mock data replaced with real Prisma queries.
 * The function signatures are IDENTICAL to Day 2 — pages don't change at all.
 * This is the power of the data layer pattern: swap the implementation,
 * the UI never knows.
 *
 * DAY 5: Add userId parameter everywhere for auth-based filtering.
 * Currently using DEV_USER_ID as a placeholder.
 *
 * WHY NOT QUERY FROM PAGES DIRECTLY?
 *   Pages shouldn't know about Prisma, SQL, or database structure.
 *   They call a named function and get typed data back. If we switch
 *   from Prisma to Drizzle, or from PostgreSQL to MySQL, only this file
 *   changes — zero page changes.
 */

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ─── Temporary dev constant ───────────────────────────────────────────────────
// Day 5: Replace with: const { userId } = await auth()
// This is the ID we created in prisma/seed.ts
const DEV_USER_ID = "user_dev_seed";

// ─── Types ────────────────────────────────────────────────────────────────────
// Re-export from Prisma's generated types so pages import from one place.
// When we add fields to the schema, these types update automatically.

// A trade with all scalar fields (no relations)
export type Trade = Prisma.TradeGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

export type DashboardStats = {
  totalTrades: number;
  closedTrades: number;
  netPnl: number;
  winRate: number;
  profitFactor: number;
  avgRMultiple: number;
};

// ─── Data Access Functions ────────────────────────────────────────────────────

/**
 * getDashboardStats()
 * Real implementation using Prisma aggregation.
 * Day 2 used: await simulate(150) + in-memory computation
 * Day 3 uses: db.trade.aggregate() → PostgreSQL does the math
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Run both aggregation queries in parallel
  const [totalCount, closedTrades] = await Promise.all([
    db.trade.count({ where: { userId: DEV_USER_ID } }),
    db.trade.findMany({
      where: { userId: DEV_USER_ID, status: "CLOSED" },
      select: { pnl: true, rMultiple: true },
    }),
  ]);

  const pnlValues = closedTrades
    .map((t) => Number(t.pnl ?? 0))
    .filter((_, i) => closedTrades[i].pnl !== null);

  const wins = pnlValues.filter((p) => p > 0);
  const losses = pnlValues.filter((p) => p < 0);

  const netPnl = pnlValues.reduce((sum, p) => sum + p, 0);
  const grossProfit = wins.reduce((sum, p) => sum + p, 0);
  const grossLoss = Math.abs(losses.reduce((sum, p) => sum + p, 0));

  const winRate =
    pnlValues.length > 0 ? (wins.length / pnlValues.length) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  const rValues = closedTrades
    .map((t) => Number(t.rMultiple))
    .filter((r) => !isNaN(r) && isFinite(r));
  const avgRMultiple =
    rValues.length > 0
      ? rValues.reduce((sum, r) => sum + r, 0) / rValues.length
      : 0;

  return {
    totalTrades: totalCount,
    closedTrades: closedTrades.length,
    netPnl,
    winRate,
    profitFactor,
    avgRMultiple,
  };
}

/**
 * getRecentTrades()
 * Real Prisma query: findMany + orderBy + take + include
 */
export async function getRecentTrades(limit = 5): Promise<Trade[]> {
  return db.trade.findMany({
    where: { userId: DEV_USER_ID },
    orderBy: { openedAt: "desc" },
    take: limit,
    include: {
      tags: { include: { tag: true } },
    },
  });
}

/**
 * getTradeById()
 * Prisma findUnique — returns null if not found (not throwing).
 * The page calls notFound() when null is returned.
 */
export async function getTradeById(id: string): Promise<Trade | null> {
  return db.trade.findUnique({
    where: { id, userId: DEV_USER_ID },
    include: {
      tags: { include: { tag: true } },
      journal: true,
    },
  });
}

/**
 * getAllTrades()
 * Returns all trades for the user, newest first.
 * Day 10: Add pagination + filtering params.
 */
export async function getAllTrades(): Promise<Trade[]> {
  return db.trade.findMany({
    where: { userId: DEV_USER_ID },
    orderBy: { openedAt: "desc" },
    include: {
      tags: { include: { tag: true } },
    },
  });
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────
// Pure functions — safe anywhere (server + client).
// Accepts number | Decimal (Prisma type) | null for convenience.
// Prisma's Decimal has .toString() and arithmetic works via Number() conversion.

type Numeric = number | { toString(): string } | null | undefined;

function toNumber(v: Numeric): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "number" ? v : Number(v.toString());
}

export function formatPnl(pnl: Numeric): string {
  const n = toNumber(pnl);
  const sign = n >= 0 ? "+" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatR(r: Numeric): string {
  const n = toNumber(r);
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}R`;
}

// Helper used in pages to compare Decimal values
export function toNum(v: Numeric): number {
  return toNumber(v);
}

