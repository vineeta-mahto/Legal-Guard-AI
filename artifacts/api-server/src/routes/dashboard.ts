import { Router } from "express";
import { db } from "@workspace/db";
import { contractsTable, approvalsTable, auditEventsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [contractsProcessed] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contractsTable);

    const [pendingApprovalsRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(approvalsTable)
      .where(eq(approvalsTable.status, "pending"));

    const [blockedActionsRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(approvalsTable)
      .where(eq(approvalsTable.status, "rejected"));

    const recentActivity = await db
      .select()
      .from(auditEventsTable)
      .orderBy(desc(auditEventsTable.timestamp))
      .limit(5);

    const contractsByStatus = await db
      .select({
        status: contractsTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(contractsTable)
      .groupBy(contractsTable.status);

    const approvalsByRisk = await db
      .select({
        level: approvalsTable.riskLevel,
        count: sql<number>`count(*)::int`,
      })
      .from(approvalsTable)
      .groupBy(approvalsTable.riskLevel);

    res.json({
      pendingApprovals: pendingApprovalsRow?.count ?? 0,
      contractsProcessed: contractsProcessed?.count ?? 0,
      blockedActions: blockedActionsRow?.count ?? 0,
      aiConfidence: 94.7,
      averageRiskScore: 42.3,
      agentHealth: "healthy",
      recentActivity: recentActivity.map((e) => ({
        ...e,
        timestamp: e.timestamp.toISOString(),
      })),
      contractsByStatus: contractsByStatus.map((r) => ({
        status: r.status,
        count: r.count,
      })),
      approvalsByRisk: approvalsByRisk.map((r) => ({
        level: r.level,
        count: r.count,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
