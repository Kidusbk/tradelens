/**
 * Trade Not Found — src/app/(app)/trades/[id]/not-found.tsx
 *
 * WHERE: Server Component. Rendered when page.tsx calls notFound().
 * WHY:   A trade-specific 404 is more helpful than the global 404.
 *        It tells the user "this trade wasn't found" and links back
 *        to the trades list, not back to the homepage.
 *
 * SCOPE: Only triggered from within the /trades/[id]/ route segment.
 *        The global not-found.tsx handles all other 404s.
 */

import Link from "next/link";

export default function TradeNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "4rem",
          fontWeight: 800,
          color: "var(--color-surface-3)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        Trade not found
      </h2>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          marginBottom: "1.5rem",
          maxWidth: "320px",
        }}
      >
        This trade doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/trades"
        style={{
          backgroundColor: "var(--color-brand-500)",
          color: "white",
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 500,
          padding: "0.625rem 1.25rem",
          borderRadius: "0.5rem",
        }}
      >
        ← Back to trades
      </Link>
    </div>
  );
}
