/**
 * Global Not Found — src/app/not-found.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHY:   Next.js automatically renders this when:
 *        1. A route is not matched by any page.tsx
 *        2. A page calls the notFound() function from 'next/navigation'.
 *
 * WHAT:  The global 404 page. It is wrapped by the root layout only
 *        (not by (auth) or (app) layouts — it sits at the app root).
 *
 * Later: Dynamic routes like /trades/[id] will call notFound() when a trade
 *        ID doesn't exist in the database, sending the user here.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-surface-0)",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "6rem",
          fontWeight: 800,
          color: "var(--color-surface-3)",
          lineHeight: 1,
          marginBottom: "1rem",
          letterSpacing: "-0.05em",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          marginBottom: "2rem",
          maxWidth: "320px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
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
        ← Back to home
      </Link>
    </div>
  );
}
