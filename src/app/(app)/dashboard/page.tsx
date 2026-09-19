/**
 * Dashboard Page — src/app/(app)/dashboard/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHY:   Dashboard data (P&L, win rate, equity curve) will come from the
 *        database. Server Components can query the database directly without
 *        an API layer. The result is rendered to HTML on the server — faster
 *        initial load, no loading spinner for the initial data.
 *
 * WHAT:  Matches URL /dashboard. Rendered inside (app)/layout.tsx (sidebar).
 *
 * Day 1: Static placeholder to verify the (app) route group and layout work.
 * Day 8: Real analytics queries using Prisma + seeded trade data.
 * Day 9: Interactive charts (equity curve, P&L distribution).
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Placeholder KPI cards — will be replaced with real database queries on Day 8.
// Note: No 'use client', no useState, no useEffect. Pure server render.
const placeholderKpis = [
  { label: "Net P&L", value: "$0.00", change: "0 trades" },
  { label: "Win Rate", value: "0%", change: "No closed trades" },
  { label: "Profit Factor", value: "—", change: "Need more data" },
  { label: "Avg R-Multiple", value: "—", change: "Need more data" },
] as const;

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
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

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {placeholderKpis.map((kpi) => (
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
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                marginBottom: "0.25rem",
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Chart placeholder — Day 9 */}
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
          Equity curve chart — coming Day 9
          <br />
          <span style={{ fontSize: "0.75rem" }}>
            Will render from real trade data via Prisma + Recharts
          </span>
        </div>
      </div>

      {/* Recent trades placeholder — Day 6 */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: "1rem",
          }}
        >
          Recent Trades
        </h2>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--color-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          No trades yet. Trade CRUD coming Day 6.
        </div>
      </div>
    </div>
  );
}
