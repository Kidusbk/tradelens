/**
 * App-level Loading — src/app/(app)/loading.tsx
 *
 * WHERE: Server Component. Rendered instantly on the server.
 * WHY:   This is the fallback for ANY route inside (app)/ that doesn't
 *        have its own more specific loading.tsx file.
 *
 * WHAT:  Next.js automatically wraps the matched page.tsx in a <Suspense>
 *        boundary with this component as the fallback. It shows immediately
 *        while page.tsx is executing its async data fetching.
 *
 * Hierarchy:
 *   (app)/loading.tsx  ← catches any (app)/ route without its own loading.tsx
 *   (app)/dashboard/loading.tsx  ← overrides this for /dashboard specifically
 *   (app)/trades/loading.tsx     ← overrides this for /trades specifically
 *
 * NOTE: loading.tsx does NOT accept any props. It has no access to params
 * or searchParams because it renders before the page resolves.
 */

import { KpiCardSkeleton, TableRowSkeleton } from "@/components/skeleton";

export default function AppLoading() {
  return (
    <div>
      {/* Page header skeleton */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            height: "28px",
            width: "160px",
            borderRadius: "0.375rem",
            backgroundColor: "var(--color-surface-2)",
            marginBottom: "0.5rem",
          }}
        />
        <div
          style={{
            height: "14px",
            width: "260px",
            borderRadius: "0.375rem",
            backgroundColor: "var(--color-surface-2)",
          }}
        />
      </div>

      {/* KPI card skeletons — 4 columns matching the real dashboard layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      {/* Chart area skeleton */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          height: "300px",
          marginBottom: "1.5rem",
        }}
      />

      {/* Table skeleton */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
