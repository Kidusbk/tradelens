/**
 * Skeleton — src/components/skeleton.tsx
 *
 * WHERE: Server Component (no 'use client' — no interactivity needed).
 * WHY:   A reusable animated placeholder shown while real content loads.
 *        This is the building block for all loading states in the app.
 *
 * The shimmer animation is pure CSS — zero JavaScript, zero hydration cost.
 * It renders in the first HTML byte alongside the layout, before any data
 * has been fetched. That's what makes it feel instant.
 */

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "0.375rem",
        backgroundColor: "var(--color-surface-2)",
        // The shimmer: a moving gradient from surface-2 to surface-3 and back.
        // backgroundSize must be larger than the element for the sweep effect.
        backgroundImage:
          "linear-gradient(90deg, var(--color-surface-2) 25%, var(--color-surface-3) 50%, var(--color-surface-2) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

/**
 * KpiCardSkeleton — placeholder for a single KPI stat card.
 * Matches the visual layout of the real KPI card so the swap is seamless.
 */
export function KpiCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-1)",
        border: "1px solid var(--color-border)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
      }}
    >
      {/* Label */}
      <Skeleton style={{ height: "12px", width: "60%", marginBottom: "0.75rem" }} />
      {/* Value */}
      <Skeleton style={{ height: "32px", width: "80%", marginBottom: "0.5rem" }} />
      {/* Sub-label */}
      <Skeleton style={{ height: "10px", width: "40%" }} />
    </div>
  );
}

/**
 * TableRowSkeleton — placeholder for a table row.
 */
export function TableRowSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gap: "1rem",
        padding: "0.875rem 1rem",
        borderBottom: "1px solid var(--color-border-subtle)",
        alignItems: "center",
      }}
    >
      <Skeleton style={{ height: "12px", width: "70%" }} />
      <Skeleton style={{ height: "12px", width: "50%" }} />
      <Skeleton style={{ height: "12px", width: "60%" }} />
      <Skeleton style={{ height: "12px", width: "40%" }} />
      <Skeleton style={{ height: "12px", width: "55%" }} />
    </div>
  );
}
