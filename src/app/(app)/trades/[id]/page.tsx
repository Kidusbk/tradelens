/**
 * Trade Detail Page — src/app/(app)/trades/[id]/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHAT:  Matches URL /trades/trd_001, /trades/trd_002, etc.
 *
 * DYNAMIC ROUTE: The [id] folder makes this a dynamic segment.
 * Next.js captures the URL segment and passes it as params.
 *
 * CRITICAL Next.js 16 API:
 *   params is a Promise<{ id: string }>
 *   You MUST await it before accessing params.id.
 *   This is a breaking change from Next.js 14.
 *
 * NOT FOUND PATTERN:
 *   1. getTradeById() returns null (not throwing) when trade is missing.
 *   2. We check for null and call notFound().
 *   3. notFound() triggers trades/[id]/not-found.tsx (or the nearest parent).
 *   This is the correct pattern — throwing from the data layer would
 *   trigger the error boundary instead of the 404 page.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTradeById, formatPnl, formatR } from "@/lib/data";
import Link from "next/link";

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────
// generateMetadata runs on the server before the page renders.
// It can also fetch data — Next.js de-duplicates the fetch with the page's call.

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trade = await getTradeById(id);

  if (!trade) {
    return { title: "Trade not found" };
  }

  return {
    title: `${trade.symbol} ${trade.direction} — ${trade.openedAt.toLocaleDateString()}`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TradeDetailPage({ params }: Props) {
  // Step 1: await params (required in Next.js 16)
  const { id } = await params;

  // Step 2: fetch the trade from the data layer
  const trade = await getTradeById(id);

  // Step 3: handle not found — call notFound() BEFORE any streaming starts
  // (before any await that might trigger streaming)
  if (!trade) {
    notFound();
  }

  const isLong = trade.direction === "LONG";
  const hasPnl = trade.pnl !== null;

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          marginBottom: "1.25rem",
          display: "flex",
          gap: "0.375rem",
          alignItems: "center",
        }}
      >
        <Link
          href="/trades"
          style={{ color: "var(--color-brand-400)", textDecoration: "none" }}
        >
          Trades
        </Link>
        <span>/</span>
        <span>{trade.symbol}</span>
      </div>

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
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.025em",
              }}
            >
              {trade.symbol}
            </h1>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: isLong ? "oklch(30% 0.08 145)" : "oklch(30% 0.08 25)",
                color: isLong ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {trade.direction}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: trade.status === "OPEN" ? "oklch(30% 0.06 260)" : "oklch(22% 0.02 250)",
                color: trade.status === "OPEN" ? "var(--color-brand-400)" : "var(--color-text-muted)",
              }}
            >
              {trade.status}
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            {trade.strategy ?? "No strategy tagged"} ·{" "}
            {trade.openedAt.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* P&L badge */}
        {hasPnl && (
          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: (trade.pnl ?? 0) >= 0 ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {formatPnl(trade.pnl!)}
            </div>
            {trade.rMultiple !== null && (
              <div
                style={{
                  fontSize: "0.875rem",
                  color: trade.rMultiple >= 0 ? "var(--color-success)" : "var(--color-danger)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {formatR(trade.rMultiple)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { label: "Entry Price", value: trade.entryPrice.toFixed(2), mono: true },
          {
            label: "Exit Price",
            value: trade.exitPrice?.toFixed(2) ?? "—",
            mono: true,
          },
          {
            label: "Position Size",
            value: `${trade.positionSize} contract${trade.positionSize !== 1 ? "s" : ""}`,
            mono: false,
          },
          {
            label: "Opened",
            value: trade.openedAt.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            mono: false,
          },
          {
            label: "Closed",
            value: trade.closedAt
              ? trade.closedAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Still open",
            mono: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: "var(--color-surface-1)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.75rem",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.375rem",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                fontFamily: item.mono ? "var(--font-mono)" : "inherit",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Trade ID — useful for debugging, matches our data layer IDs */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          padding: "0.75rem",
          backgroundColor: "var(--color-surface-1)",
          borderRadius: "0.5rem",
          border: "1px solid var(--color-border)",
        }}
      >
        Trade ID: {trade.id}
      </div>
    </div>
  );
}
