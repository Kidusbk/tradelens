"use client";

/**
 * App-level Error Boundary — src/app/(app)/error.tsx
 *
 * WHERE: CLIENT Component. This MUST be 'use client'.
 * WHY:   React Error Boundaries require client-side lifecycle methods.
 *        The 'use client' directive is NOT optional here — it's required
 *        by the React/Next.js spec.
 *
 * WHAT:  Catches any unhandled errors thrown by page.tsx (or its children)
 *        inside the (app)/ route group. Shows a recovery UI instead of a
 *        blank screen.
 *
 * PROPS (provided by Next.js automatically):
 *   error  — the Error object that was thrown (message, digest)
 *   retry  — function to re-render the failed segment (NEW in Next.js 16,
 *             previously called 'reset')
 *
 * SECURITY: In PRODUCTION, Server Component errors have their message
 * replaced with a generic string. Only `error.digest` (a hash) is exposed.
 * This prevents leaking database errors, file paths, or secrets to users.
 * In DEVELOPMENT, the real error message is shown for debugging.
 *
 * This error boundary does NOT catch:
 *   - Errors in (app)/layout.tsx (the layout is above the boundary)
 *   - Errors in loading.tsx (loading is outside the boundary)
 * For those, you need global-error.tsx at the root.
 */

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function AppError({ error, retry }: ErrorProps) {
  useEffect(() => {
    // In a real app: send to error monitoring (Sentry, Datadog, etc.)
    // In development: this logs the real error message.
    // In production: error.message may be a generic string from Next.js.
    console.error("[AppError boundary]", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Error icon */}
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>

      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          marginBottom: "0.5rem",
          maxWidth: "400px",
        }}
      >
        An unexpected error occurred. You can try again, or contact support
        if the problem persists.
      </p>

      {/*
        Show the digest in dev and production — it's a safe hash that lets
        engineers correlate the client error with server logs.
        Never show error.message directly in production UI.
      */}
      {error.digest && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            marginBottom: "1.5rem",
          }}
        >
          Error ID: {error.digest}
        </p>
      )}

      <button
        onClick={retry}
        style={{
          backgroundColor: "var(--color-brand-500)",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.625rem 1.25rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
