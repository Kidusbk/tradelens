/**
 * Database Seed Script — prisma/seed.ts
 *
 * WHY SEED?
 *   Every developer needs realistic data to work with.
 *   Without seeding, every time you reset the database you'd have to
 *   manually click around to create test data. This automates it.
 *
 * HOW TO RUN:
 *   npx prisma db seed
 *   (also runs automatically after `prisma migrate reset`)
 *
 * WHAT THIS CREATES:
 *   1 User → 1 Account → 5 Trades (matching our Day 2 mock data) + 3 Tags
 *
 * DAY 5: When auth is added, the seed user will have a hashed password.
 */

import { PrismaClient, TradeDirection, TradeStatus, TradingSession } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Wipe in the correct order (respecting foreign key constraints)
  await prisma.journalEntry.deleteMany();
  await prisma.tradeTag.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ─── Create user ────────────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      id: "user_dev_seed",
      email: "trader@tradelens.dev",
      name: "Dev Trader",
    },
  });
  console.log(`  ✓ User: ${user.email}`);

  // ─── Create trading account ──────────────────────────────────────────────────
  const account = await prisma.account.create({
    data: {
      name: "Apex Funded Account",
      broker: "NinjaTrader",
      currency: "USD",
      userId: user.id,
    },
  });
  console.log(`  ✓ Account: ${account.name}`);

  // ─── Create tags ─────────────────────────────────────────────────────────────
  const [momentumTag, meanRevTag, trendTag] = await Promise.all([
    prisma.tag.create({
      data: { name: "momentum", color: "#6366f1", userId: user.id },
    }),
    prisma.tag.create({
      data: { name: "mean-reversion", color: "#f59e0b", userId: user.id },
    }),
    prisma.tag.create({
      data: { name: "trend", color: "#10b981", userId: user.id },
    }),
  ]);
  console.log(`  ✓ Tags: momentum, mean-reversion, trend`);

  // ─── Create trades ───────────────────────────────────────────────────────────
  // Same data as our Day 2 mock data — now it's in a real database.

  const trades = await Promise.all([
    prisma.trade.create({
      data: {
        id: "trd_001",
        symbol: "NQ",
        direction: TradeDirection.LONG,
        status: TradeStatus.CLOSED,
        entryPrice: 21450.5,
        exitPrice: 21512.75,
        stopLoss: 21400.0,
        positionSize: 1,
        pnl: 1245.0,
        rMultiple: 2.1,
        strategy: "Momentum Breakout",
        session: TradingSession.NEW_YORK,
        openedAt: new Date("2026-09-20T09:32:00Z"),
        closedAt: new Date("2026-09-20T11:15:00Z"),
        userId: user.id,
        accountId: account.id,
        tags: { create: [{ tagId: momentumTag.id }] },
        journal: {
          create: {
            preThoughts: "Strong gap up on NQ. Looking for first pullback to VWAP for continuation long.",
            postThoughts: "Entry was clean. Held through a minor pullback. Target hit at +2R.",
            lessonsLearned: "Patience paid off — waited for the setup instead of chasing.",
          },
        },
      },
    }),

    prisma.trade.create({
      data: {
        id: "trd_002",
        symbol: "ES",
        direction: TradeDirection.SHORT,
        status: TradeStatus.CLOSED,
        entryPrice: 5820.25,
        exitPrice: 5805.5,
        stopLoss: 5828.0,
        positionSize: 2,
        pnl: 1475.0,
        rMultiple: 1.8,
        strategy: "Mean Reversion",
        session: TradingSession.NEW_YORK,
        openedAt: new Date("2026-09-20T13:45:00Z"),
        closedAt: new Date("2026-09-20T14:20:00Z"),
        userId: user.id,
        accountId: account.id,
        tags: { create: [{ tagId: meanRevTag.id }] },
      },
    }),

    prisma.trade.create({
      data: {
        id: "trd_003",
        symbol: "NQ",
        direction: TradeDirection.LONG,
        status: TradeStatus.CLOSED,
        entryPrice: 21380.0,
        exitPrice: 21340.25,
        stopLoss: 21340.0,
        positionSize: 1,
        pnl: -795.0,
        rMultiple: -1.0,
        strategy: "Momentum Breakout",
        session: TradingSession.NEW_YORK,
        notes: "Entered too early. Didn't wait for confirmation. Took a -1R loss.",
        openedAt: new Date("2026-09-21T10:00:00Z"),
        closedAt: new Date("2026-09-21T10:35:00Z"),
        userId: user.id,
        accountId: account.id,
        tags: { create: [{ tagId: momentumTag.id }] },
      },
    }),

    prisma.trade.create({
      data: {
        id: "trd_004",
        symbol: "GC",
        direction: TradeDirection.LONG,
        status: TradeStatus.CLOSED,
        entryPrice: 2682.4,
        exitPrice: 2695.8,
        stopLoss: 2676.0,
        positionSize: 1,
        pnl: 1340.0,
        rMultiple: 2.4,
        strategy: "Trend Following",
        session: TradingSession.LONDON,
        openedAt: new Date("2026-09-21T14:30:00Z"),
        closedAt: new Date("2026-09-22T09:10:00Z"),
        userId: user.id,
        accountId: account.id,
        tags: { create: [{ tagId: trendTag.id }] },
      },
    }),

    prisma.trade.create({
      data: {
        id: "trd_005",
        symbol: "ES",
        direction: TradeDirection.LONG,
        status: TradeStatus.OPEN,
        entryPrice: 5835.0,
        stopLoss: 5822.0,
        positionSize: 1,
        strategy: "Momentum Breakout",
        session: TradingSession.NEW_YORK,
        openedAt: new Date("2026-09-23T09:35:00Z"),
        userId: user.id,
        accountId: account.id,
      },
    }),
  ]);

  console.log(`  ✓ Trades: ${trades.length} created`);
  console.log("\n✅ Seed complete!");
  console.log(`\n   User ID:    ${user.id}`);
  console.log(`   Account ID: ${account.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
