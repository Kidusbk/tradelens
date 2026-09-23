/**
 * Data Layer — src/lib/data.ts
 *
 * WHERE: Server-only. This module MUST NEVER be imported by Client Components.
 * WHY:   All data access logic lives here, isolated from the UI layer.
 *        Today: simulated with fake data + artificial delays.
 *        Day 3: Replace with real Prisma queries.
 *        Day 5: Add userId filtering for authorization.
 *
 * The artificial delays (simulate()) are here deliberately so you can SEE
 * streaming in action in the browser's Network tab. Slow = visible streaming.
 * Remove them once Prisma is wired up.
 *
 * PATTERN: Functions here are async and return typed data.
 * The pages that call them are Server Components — they await directly,
 * no useEffect, no fetch('/api/...'), no loading state in the component.
 * The loading.tsx file handles the loading state.
 */

// Simulates a database query with artificial latency.
// You can see this working in the browser: the layout + skeleton render
// instantly, then content streams in after this delay resolves.
function simulate(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Types ───────────────────────────────────────────────────────────────────
// These will be replaced by generated Prisma types on Day 3.
// Defining them here now so TypeScript is happy and we learn the data shape.

export type TradeDirection = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED";

export type Trade = {
  id: string;
  symbol: string;
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  exitPrice: number | null;
  positionSize: number;
  pnl: number | null;
  rMultiple: number | null;
  strategy: string | null;
  openedAt: Date;
  closedAt: Date | null;
};

export type DashboardStats = {
  totalTrades: number;
  closedTrades: number;
  netPnl: number;
  winRate: number;
  profitFactor: number;
  avgRMultiple: number;
};

// ─── Simulated Data ──────────────────────────────────────────────────────────
// Realistic-looking trade data. Day 3 this comes from PostgreSQL via Prisma.

const MOCK_TRADES: Trade[] = [
  {
    id: "trd_001",
    symbol: "NQ",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 21450.5,
    exitPrice: 21512.75,
    positionSize: 1,
    pnl: 1245.0,
    rMultiple: 2.1,
    strategy: "Momentum Breakout",
    openedAt: new Date("2026-09-20T09:32:00Z"),
    closedAt: new Date("2026-09-20T11:15:00Z"),
  },
  {
    id: "trd_002",
    symbol: "ES",
    direction: "SHORT",
    status: "CLOSED",
    entryPrice: 5820.25,
    exitPrice: 5805.5,
    positionSize: 2,
    pnl: 1475.0,
    rMultiple: 1.8,
    strategy: "Mean Reversion",
    openedAt: new Date("2026-09-20T13:45:00Z"),
    closedAt: new Date("2026-09-20T14:20:00Z"),
  },
  {
    id: "trd_003",
    symbol: "NQ",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 21380.0,
    exitPrice: 21340.25,
    positionSize: 1,
    pnl: -795.0,
    rMultiple: -1.0,
    strategy: "Momentum Breakout",
    openedAt: new Date("2026-09-21T10:00:00Z"),
    closedAt: new Date("2026-09-21T10:35:00Z"),
  },
  {
    id: "trd_004",
    symbol: "GC",
    direction: "LONG",
    status: "CLOSED",
    entryPrice: 2682.4,
    exitPrice: 2695.8,
    positionSize: 1,
    pnl: 1340.0,
    rMultiple: 2.4,
    strategy: "Trend Following",
    openedAt: new Date("2026-09-21T14:30:00Z"),
    closedAt: new Date("2026-09-22T09:10:00Z"),
  },
  {
    id: "trd_005",
    symbol: "ES",
    direction: "LONG",
    status: "OPEN",
    entryPrice: 5835.0,
    exitPrice: null,
    positionSize: 1,
    pnl: null,
    rMultiple: null,
    strategy: "Momentum Breakout",
    openedAt: new Date("2026-09-23T09:35:00Z"),
    closedAt: null,
  },
];

// ─── Data Access Functions ────────────────────────────────────────────────────

/**
 * getDashboardStats()
 *
 * WHERE: Called in Server Components (dashboard page).
 * WHAT:  Computes aggregate trading statistics.
 * DAY 3: Replace with Prisma aggregation queries.
 * DAY 5: Add userId parameter for authorization.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Simulate a database aggregation query (150ms)
  await simulate(150);

  const closedTrades = MOCK_TRADES.filter(
    (t) => t.status === "CLOSED" && t.pnl !== null
  );

  const winningTrades = closedTrades.filter((t) => (t.pnl ?? 0) > 0);
  const losingTrades = closedTrades.filter((t) => (t.pnl ?? 0) < 0);

  const netPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const grossLoss = Math.abs(
    losingTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
  );

  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  const rValues = closedTrades
    .map((t) => t.rMultiple)
    .filter((r): r is number => r !== null);

  const avgRMultiple =
    rValues.length > 0
      ? rValues.reduce((sum, r) => sum + r, 0) / rValues.length
      : 0;

  return {
    totalTrades: MOCK_TRADES.length,
    closedTrades: closedTrades.length,
    netPnl,
    winRate,
    profitFactor,
    avgRMultiple,
  };
}

/**
 * getRecentTrades()
 *
 * WHERE: Called in Server Components.
 * WHAT:  Returns the N most recent trades.
 * DAY 3: Replace with Prisma findMany + orderBy + take.
 */
export async function getRecentTrades(limit = 5): Promise<Trade[]> {
  // Simulate a DB query with slightly different latency than getDashboardStats.
  // This is intentional — it shows how Suspense handles parallel async work.
  await simulate(200);

  return [...MOCK_TRADES]
    .sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime())
    .slice(0, limit);
}

/**
 * getTradeById()
 *
 * WHERE: Called in Server Components (trade detail page).
 * WHAT:  Returns a single trade by ID, or null if not found.
 * NOTE:  Returning null (not throwing) lets the PAGE decide what to do.
 *        The page then calls notFound() — keeping the 404 logic in the UI layer.
 * DAY 3: Replace with Prisma findUnique.
 * DAY 5: Add ownership check: if trade.userId !== session.userId → notFound()
 */
export async function getTradeById(id: string): Promise<Trade | null> {
  await simulate(100);
  return MOCK_TRADES.find((t) => t.id === id) ?? null;
}

/**
 * getAllTrades()
 *
 * WHERE: Called in Server Components (trades list page).
 * WHAT:  Returns all trades (will add filtering/pagination on Day 10).
 * DAY 3: Replace with Prisma findMany.
 */
export async function getAllTrades(): Promise<Trade[]> {
  await simulate(180);
  return [...MOCK_TRADES].sort(
    (a, b) => b.openedAt.getTime() - a.openedAt.getTime()
  );
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────
// These are pure functions — no async, no server, safe anywhere.

export function formatPnl(pnl: number): string {
  const sign = pnl >= 0 ? "+" : "";
  return `${sign}$${Math.abs(pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatR(r: number): string {
  const sign = r >= 0 ? "+" : "";
  return `${sign}${r.toFixed(2)}R`;
}
