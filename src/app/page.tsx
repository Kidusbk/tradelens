/**
 * Landing Page — src/app/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHY:   No interactivity needed here — pure static marketing content.
 *        Server Components reduce JS bundle size to zero for this page.
 * WHAT:  The marketing landing page at route "/".
 *
 * Next.js metadata can also be exported from page.tsx to override
 * the root layout's metadata for this specific route.
 */

import Link from "next/link";
import type { Metadata } from "next";

// This metadata merges with (and can override) the root layout metadata.
// The title uses the template defined in layout.tsx: "TradeLens | TradeLens"
// — we override it here to just "TradeLens" since this is the home page.
export const metadata: Metadata = {
  title: "TradeLens — Trading Journal & Analytics",
  description:
    "Record trades, analyze performance, and grow as a trader with TradeLens.",
};

// The features list is defined as a plain array — no database needed yet.
// When we add real data, this Server Component will fetch directly from Prisma.
const features = [
  {
    icon: "📊",
    title: "Performance Analytics",
    description:
      "Win rate, profit factor, R-multiple, max drawdown — all calculated server-side from your real trade data.",
  },
  {
    icon: "📓",
    title: "Trading Journal",
    description:
      "Document your trades with notes, emotional state, strategy, and setup tags to find patterns in your behavior.",
  },
  {
    icon: "📈",
    title: "Equity Curve",
    description:
      "Visualize your account growth over time with an interactive equity curve built from your actual trade history.",
  },
  {
    icon: "🔍",
    title: "Trade Filtering",
    description:
      "Filter by symbol, strategy, session, date range, and outcome. Server-side filtering handles any volume of trades.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface-1)",
        }}
      >
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo — a Server Component can render static markup with zero JS */}
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--color-brand-400)",
              letterSpacing: "-0.025em",
            }}
          >
            TradeLens
          </span>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {/*
              Link from next/link — NOT a plain <a> tag.
              Link enables client-side navigation (no full page reload).
              It also prefetches the target route when the link enters the viewport.
              The href="/login" matches src/app/(auth)/login/page.tsx.
              The (auth) group is invisible in the URL.
            */}
            <Link
              href="/login"
              style={{
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                transition: "color 0.15s",
              }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              style={{
                backgroundColor: "var(--color-brand-500)",
                color: "white",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
              }}
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "6rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "9999px",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--color-profit)",
                display: "inline-block",
              }}
            />
            Now in development · Day 1
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "var(--color-text-primary)",
              marginBottom: "1.5rem",
            }}
          >
            Trade smarter.
            <br />
            <span style={{ color: "var(--color-brand-400)" }}>
              Analyze deeper.
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-secondary)",
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
            }}
          >
            TradeLens is a professional trading journal and analytics platform.
            Record every trade, track your performance, and discover what
            actually makes you profitable.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{
                backgroundColor: "var(--color-brand-500)",
                color: "white",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "0.75rem 1.75rem",
                borderRadius: "0.5rem",
              }}
            >
              Start journaling free →
            </Link>
            <Link
              href="/login"
              style={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: 500,
                padding: "0.75rem 1.75rem",
                borderRadius: "0.5rem",
              }}
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem 6rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{
                  backgroundColor: "var(--color-surface-1)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1.5rem",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.875rem",
        }}
      >
        TradeLens — Learning project. Not financial advice.
      </footer>
    </div>
  );
}

