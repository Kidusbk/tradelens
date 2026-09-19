/**
 * App Layout — src/app/(app)/layout.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHY:   All authenticated app routes (dashboard, trades, accounts, journal)
 *        share a common shell: a fixed sidebar + scrollable main content area.
 *        This layout provides that shell without repeating it in every page.
 *
 * WHAT:  Applied to all routes inside the (app) route group:
 *        /dashboard, /trades, /trades/[id], /accounts, /journal, etc.
 *
 * Day 1: Static sidebar placeholder.
 * Day 5: Will check authentication here and redirect unauthenticated users.
 *         The session check runs SERVER-SIDE — not in the browser.
 *
 * Critically: This layout does NOT contain html/body.
 * Nesting: Root Layout → (app) Layout → Dashboard Page
 */

import Link from "next/link";

// Navigation items for the sidebar.
// This is just a plain array — no 'use client' needed for static content.
// When we add active link highlighting (Day 1 challenge!), we'll need a
// Client Component for that specific interactive piece.
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/trades", label: "Trades", icon: "⇅" },
  { href: "/accounts", label: "Accounts", icon: "◈" },
  { href: "/journal", label: "Journal", icon: "✎" },
  { href: "/analytics", label: "Analytics", icon: "⟡" },
] as const;

// Using explicit type instead of LayoutProps<'/(app)'> because LayoutProps
// is a generated global — Next.js regenerates it when you run `next dev`.
// After the dev server runs with these new routes, '/(app)' will be included.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        backgroundColor: "var(--color-surface-0)",
      }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      {/*
        The sidebar is part of the layout, not the page.
        It stays mounted across navigation — zero re-render cost.
        Day 5: We'll add the authenticated user's name/avatar here.
      */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          backgroundColor: "var(--color-surface-1)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem 0",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 1.25rem",
            marginBottom: "1.5rem",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "var(--color-brand-400)",
            letterSpacing: "-0.025em",
          }}
        >
          TradeLens
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "0 0.75rem" }}>
          {navItems.map((item) => (
            /*
              Each nav item uses next/link for client-side navigation.
              IMPORTANT: The sidebar is a Server Component, so we cannot
              use usePathname() here to detect the active route.
              We will create a separate <NavLink> Client Component for
              active state highlighting — that's the minimum client boundary.
            */
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "0.125rem",
              }}
            >
              <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom user section — placeholder for Day 5 */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid var(--color-border)",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--color-brand-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              U
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                User Name
              </div>
              <div
                style={{
                  fontSize: "0.625rem",
                  color: "var(--color-text-muted)",
                }}
              >
                user@example.com
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────── */}
      {/*
        `children` is replaced by the matched page on each navigation.
        The sidebar stays mounted; only this area re-renders.
      */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header
          style={{
            height: "56px",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-1)",
            display: "flex",
            alignItems: "center",
            padding: "0 1.5rem",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
            }}
          >
            {/* Day 5: Will show current page breadcrumb */}
            TradeLens App
          </span>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1.5rem",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
