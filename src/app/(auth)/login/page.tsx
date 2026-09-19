/**
 * Login Page — src/app/(auth)/login/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHY:   The page shell is static — only the form inside will be a Client
 *        Component (Day 4, when we add interactivity and auth logic).
 * WHAT:  Matches URL /login. Rendered inside (auth)/layout.tsx.
 *
 * Day 1: Just a placeholder to verify routing works.
 * Day 4: We'll replace this with a real auth form using Server Actions.
 */

import Link from "next/link";
import type { Metadata } from "next";

// Page-level metadata — title becomes "Log in | TradeLens" via root layout template
export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your TradeLens account.",
};

export default function LoginPage() {
  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Log in to your TradeLens account
        </p>
      </div>

      {/*
        Placeholder — Day 4 will replace this with a real <LoginForm> Client Component.
        The form will use React Hook Form + Zod + Server Actions.
      */}
      <div
        style={{
          border: "1px dashed var(--color-border)",
          borderRadius: "0.5rem",
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.875rem",
        }}
      >
        Auth form coming Day 4
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{ color: "var(--color-brand-400)", textDecoration: "none" }}
        >
          Register
        </Link>
      </p>
    </>
  );
}
