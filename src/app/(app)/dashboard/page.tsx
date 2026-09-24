/**
 * Dashboard Page — src/app/(app)/dashboard/page.tsx
 *
 * WHERE: Server Component (async). Executes on Node.js server.
 * WHY:   Dashboard data (P&L, win rate) comes from the database directly.
 *        No API route needed — Server Components can query the data layer.
 *
 * RENDERING MODEL: Dynamic + Streaming
 *   - Dynamic: Every request re-executes (data is user-specific, always fresh).
 *   - Streaming: The KPI cards and trade table are wrapped in separate
 *     <Suspense> boundaries. They stream in independently.
 *
 * REQUEST FLOW:
 *   1. Next.js renders layout (sidebar) instantly.
 *   2. (app)/dashboard/loading.tsx shows as skeleton.
 *   3. This page starts executing.
 *   4. getDashboardStats() and getRecentTrades() run in PARALLEL (Promise.all).
 *   5. When data resolves, skeleton is replaced with real content.
 *
 * Why not sequential awaits?
 *   // ❌ BAD — sequential, 350ms total (150 + 200)
 *   const stats = await getDashboardStats()
 *   const trades = await getRecentTrades()
 *
 *   // ✅ GOOD — parallel, 200ms total (max of 150, 200)
 *   const [stats, trades] = await Promise.all([...])
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getDashboardStats,
  getRecentTrades,
  formatPnl,
  formatPercent,
  formatR,
  toNum,
  type DashboardStats,
  type Trade,
} from "@/lib/data";
import { KpiCardSkeleton, TableRowSkeleton } from "@/components/skeleton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

// ─── Sub-components (Server Components) ──────────────────────────────────────
// We split the page into smaller async Server Components, each wrapped in
// its own <Suspense> boundary. This enables GRANULAR streaming:
// KPI cards can appear while the trade table is still loading.

async function KpiSection() {
  const stats = await getDashboardStats();
  return <KpiCards stats={stats} />;
}

async function TradesSection() {
  const trades = await getRecentTrades(5);
  return <RecentTradesTable trades={trades} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  /*
   * Notice: DashboardPage itself is NOT async.
   * It just renders the layout structure + Suspense boundaries.
   * The actual data fetching happens inside KpiSection and TradesSection,
   * which ARE async. This is the key pattern for granular streaming.
   *
   * The <Suspense fallback> shows while the async component is executing.
   * Once data resolves, React replaces the fallback with the real component.
   */
  return (
    <div>
      {/* Page header — renders instantly, no data needed */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.025em",
            marginBottom: "0.25rem",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Your trading performance overview
        </p>
      </div>

      {/*
        KPI Cards — wrapped in Suspense.
        The fallback shows 4 skeleton cards while getDashboardStats() runs.
        When the async KpiSection resolves, the skeleton is swapped for real data.
      */}
      <Suspense
        fallback={
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </div>
        }
      >
        <KpiSection />
      </Suspense>

      {/* Chart area — placeholder until Day 9 */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div style={{ fontSize: "2rem" }}>📈</div>
        <div
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textAlign: "center",
          }}
        >
          Equity curve — coming Day 9
          <br />
          <span style={{ fontSize: "0.75rem" }}>Recharts + real trade data</span>
        </div>
      </div>

      {/*
        Recent Trades Table — separate Suspense boundary.
        This streams independently from the KPI cards.
        A slow trade query won't block the KPI cards from appearing.
      */}
      <Suspense
        fallback={
          <div
            style={{
              backgroundColor: "var(--color-surface-1)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1rem 1rem 0.5rem", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ height: "16px", width: "120px", borderRadius: "0.375rem", backgroundColor: "var(--color-surface-2)" }} />
            </div>
            {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
          </div>
        }
      >
        <TradesSection />
      </Suspense>
    </div>
  );
}

// ─── Presentational Components ────────────────────────────────────────────────
// These are synchronous Server Components — they receive data as props and
// just render. No async, no data fetching. Clean separation of concerns.

function KpiCards({ stats }: { stats: DashboardStats }) {
  const kpis = [
    {
      label: "Net P&L",
      value: formatPnl(stats.netPnl),
      sub: `${stats.closedTrades} closed trades`,
      positive: stats.netPnl >= 0,
    },
    {
      label: "Win Rate",
      value: formatPercent(stats.winRate),
      sub: `${Math.round((stats.winRate / 100) * stats.closedTrades)} wins / ${stats.closedTrades} trades`,
      positive: stats.winRate >= 50,
    },
    {
      label: "Profit Factor",
      value: stats.profitFactor > 0 ? stats.profitFactor.toFixed(2) : "—",
      sub: stats.profitFactor >= 1.5 ? "Strong edge" : stats.profitFactor >= 1 ? "Marginal" : "Below breakeven",
      positive: stats.profitFactor >= 1.5,
    },
    {
      label: "Avg R-Multiple",
      value: stats.avgRMultiple !== 0 ? formatR(stats.avgRMultiple) : "—",
      sub: `${stats.totalTrades} total trades`,
      positive: stats.avgRMultiple >= 1,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          style={{
            backgroundColor: "var(--color-surface-1)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            {kpi.label}
          </div>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: kpi.positive
                ? "var(--color-success)"
                : "var(--color-danger)",
              fontFamily: "var(--font-mono)",
              marginBottom: "0.25rem",
            }}
          >
            {kpi.value}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            {kpi.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function TradeRow({ trade }: { trade: Trade }) {
  const isLong = trade.direction === "LONG";
  const hasPnl = trade.pnl !== null;
  const pnlNum = toNum(trade.pnl);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 60px 120px 100px 1fr",
        gap: "1rem",
        padding: "0.75rem 1rem",
        borderBottom: "1px solid var(--color-border)",
        alignItems: "center",
        fontSize: "0.875rem",
      }}
    >
      {/* Symbol */}
      <span style={{ fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}>
        {trade.symbol}
      </span>

      {/* Direction badge */}
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          padding: "0.125rem 0.375rem",
          borderRadius: "0.25rem",
          backgroundColor: isLong ? "oklch(30% 0.08 145)" : "oklch(30% 0.08 25)",
          color: isLong ? "var(--color-success)" : "var(--color-danger)",
          textAlign: "center",
        }}
      >
        {trade.direction}
      </span>

      {/* Entry */}
      <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
        {trade.entryPrice.toFixed(2)}
      </span>

      {/* P&L */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          color: !hasPnl
            ? "var(--color-text-muted)"
            : pnlNum >= 0
            ? "var(--color-success)"
            : "var(--color-danger)",
        }}
      >
        {hasPnl ? formatPnl(trade.pnl!) : "Open"}
      </span>

      {/* Strategy */}
      <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
        {trade.strategy ?? "—"}
      </span>
    </div>
  );
}

function RecentTradesTable({ trades }: { trades: Trade[] }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-1)",
        border: "1px solid var(--color-border)",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h2
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          Recent Trades
        </h2>
        <Link
          href="/trades"
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-brand-400)",
            textDecoration: "none",
          }}
        >
          View all →
        </Link>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 60px 120px 100px 1fr",
          gap: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span>Symbol</span>
        <span>Side</span>
        <span>Entry</span>
        <span>P&amp;L</span>
        <span>Strategy</span>
      </div>

      {/* Trade rows */}
      {trades.map((trade) => (
        <TradeRow key={trade.id} trade={trade} />
      ))}
    </div>
  );
}
