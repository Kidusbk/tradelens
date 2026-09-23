/**
 * Trades Loading State — src/app/(app)/trades/loading.tsx
 *
 * Shown while trades/page.tsx is fetching data (getAllTrades).
 * Mirrors the visual structure of the real trades table exactly.
 */

import { TableRowSkeleton } from "@/components/skeleton";

export default function TradesLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div
            style={{
              height: "28px",
              width: "80px",
              borderRadius: "0.375rem",
              backgroundColor: "var(--color-surface-2)",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "14px",
              width: "140px",
              borderRadius: "0.375rem",
              backgroundColor: "var(--color-surface-2)",
            }}
          />
        </div>
        <div
          style={{
            height: "36px",
            width: "120px",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-surface-2)",
          }}
        />
      </div>

      {/* Table skeleton */}
      <div
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
      >
        {/* Column header row */}
        <div
          style={{
            height: "36px",
            backgroundColor: "var(--color-surface-0)",
            borderBottom: "1px solid var(--color-border)",
          }}
        />
        {/* Data rows */}
        {[...Array(6)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
