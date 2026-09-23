/**
 * Trades List Page — src/app/(app)/trades/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHAT:  Matches URL /trades. Shows all trades in a table.
 *
 * Day 2: Real data from mock layer (lib/data.ts).
 * Day 6: Add Server Action for creating trades.
 * Day 10: Add filtering, sorting, pagination.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getAllTrades, formatPnl, formatR, type Trade } from "@/lib/data";

export const metadata: Metadata = {
  title: "Trades",
};

export default async function TradesPage() {
  // Direct data fetch — no API route needed.
  // This await blocks rendering until data is ready.
  // loading.tsx handles the skeleton while we wait.
  const trades = await getAllTrades();

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.025em",
              marginBottom: "0.25rem",
            }}
          >
            Trades
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            {trades.length} trade{trades.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/*
          "New Trade" button placeholder.
          Day 6: This will open a modal form with a Server Action.
        */}
        <button
          disabled
          style={{
            backgroundColor: "var(--color-brand-500)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          + New Trade (Day 6)
        </button>
      </div>

      {/* Trades table */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px 60px 90px 110px 110px 100px 1fr",
            gap: "0.75rem",
            padding: "0.625rem 1rem",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-0)",
          }}
        >
          <span>Symbol</span>
          <span>Side</span>
          <span>Status</span>
          <span>Entry</span>
          <span>P&amp;L</span>
          <span>R-Multiple</span>
          <span>Strategy</span>
        </div>

        {trades.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
            }}
          >
            No trades yet. Add your first trade to get started.
          </div>
        ) : (
          trades.map((trade) => (
            <TradeTableRow key={trade.id} trade={trade} />
          ))
        )}
      </div>
    </div>
  );
}

function TradeTableRow({ trade }: { trade: Trade }) {
  const isLong = trade.direction === "LONG";
  const isOpen = trade.status === "OPEN";
  const hasPnl = trade.pnl !== null;

  return (
    /*
      Each row is a link to /trades/[id] — the dynamic route we build next.
      Using <Link> not <a> for client-side navigation + prefetching.
    */
    <Link
      href={`/trades/${trade.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "90px 60px 90px 110px 110px 100px 1fr",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--color-border)",
          alignItems: "center",
          fontSize: "0.875rem",
          cursor: "pointer",
          transition: "background-color 150ms",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor =
            "var(--color-surface-2)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.backgroundColor = "")
        }
      >
        {/* Symbol */}
        <span
          style={{
            fontWeight: 600,
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {trade.symbol}
        </span>

        {/* Direction */}
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.125rem 0.375rem",
            borderRadius: "0.25rem",
            backgroundColor: isLong
              ? "oklch(30% 0.08 145)"
              : "oklch(30% 0.08 25)",
            color: isLong ? "var(--color-success)" : "var(--color-danger)",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          {trade.direction}
        </span>

        {/* Status */}
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "0.125rem 0.375rem",
            borderRadius: "0.25rem",
            backgroundColor: isOpen
              ? "oklch(30% 0.06 260)"
              : "oklch(22% 0.02 250)",
            color: isOpen
              ? "var(--color-brand-400)"
              : "var(--color-text-muted)",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          {trade.status}
        </span>

        {/* Entry price */}
        <span
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {trade.entryPrice.toFixed(2)}
        </span>

        {/* P&L */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            color: !hasPnl
              ? "var(--color-text-muted)"
              : (trade.pnl ?? 0) >= 0
              ? "var(--color-success)"
              : "var(--color-danger)",
          }}
        >
          {hasPnl ? formatPnl(trade.pnl!) : "—"}
        </span>

        {/* R-Multiple */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color:
              trade.rMultiple === null
                ? "var(--color-text-muted)"
                : trade.rMultiple >= 0
                ? "var(--color-success)"
                : "var(--color-danger)",
          }}
        >
          {trade.rMultiple !== null ? formatR(trade.rMultiple) : "—"}
        </span>

        {/* Strategy */}
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          {trade.strategy ?? "—"}
        </span>
      </div>
    </Link>
  );
}
