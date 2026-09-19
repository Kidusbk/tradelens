/**
 * Register Page — src/app/(auth)/register/page.tsx
 *
 * WHERE: Server Component. Executes on Node.js server.
 * WHAT:  Matches URL /register. Rendered inside (auth)/layout.tsx.
 *
 * Day 1: Placeholder to verify the (auth) route group works.
 * Day 4: Real registration form with validation and Server Actions.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your TradeLens account.",
};

export default function RegisterPage() {
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
          Create your account
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Start your trading journal today
        </p>
      </div>

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
        Registration form coming Day 4
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "var(--color-brand-400)", textDecoration: "none" }}
        >
          Log in
        </Link>
      </p>
    </>
  );
}
