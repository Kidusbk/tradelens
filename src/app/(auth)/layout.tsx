/**
 * Auth Layout — src/app/(auth)/layout.tsx
 *
 * WHERE: Server Component. Runs on Node.js server.
 * WHY:   The (auth) route group needs a different visual layout than the (app)
 *        group. Login/register pages should be centered on a dark background —
 *        NOT wrapped in a sidebar shell.
 *
 * WHAT:  Renders a full-screen centered container around auth page content.
 *        Applied to: /login, /register (and any future auth routes).
 *
 * Route group behavior: The "(auth)" folder name does NOT appear in the URL.
 *   /login  →  (auth)/login/page.tsx  ✅
 *   /register → (auth)/register/page.tsx  ✅
 *
 * This layout does NOT contain html/body — those are in the root layout.
 * Layouts nest: Root → (auth)/layout → (auth)/login/page
 */

// Using explicit type instead of LayoutProps<'/(auth)'> because LayoutProps
// is a generated global — it only includes routes that have been seen by
// `next dev` or `next typegen`. After running the dev server once, the
// generated types will include '/(auth)' and you could switch back.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: "var(--color-surface-0)",
      }}
    >
      {/* Brand mark at top of auth pages */}
      <div
        style={{
          marginBottom: "2rem",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "var(--color-brand-400)",
          letterSpacing: "-0.025em",
        }}
      >
        TradeLens
      </div>

      {/* The card that wraps login/register forms */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          padding: "2rem",
        }}
      >
        {/*
          `children` here is whatever page.tsx is matched for this route.
          When the URL is /login → children = <LoginPage />
          When the URL is /register → children = <RegisterPage />
        */}
        {children}
      </div>
    </div>
  );
}
