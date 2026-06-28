import { Router } from "express";
import { db } from "@workspace/db";
import { approvalsTable, auditEventsTable, cryptoReceiptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function formatApproval(a: typeof approvalsTable.$inferSelect) {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null,
  };
}

router.get("/approvals", async (req, res) => {
  try {
    const { status } = req.query as { status?: string };
    let approvals;
    if (status) {
      approvals = await db
        .select()
        .from(approvalsTable)
        .where(eq(approvalsTable.status, status));
    } else {
      approvals = await db.select().from(approvalsTable);
    }
    res.json(approvals.map(formatApproval));
  } catch (err) {
    req.log.error({ err }, "Failed to list approvals");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/approvals/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [approval] = await db
      .select()
      .from(approvalsTable)
      .where(eq(approvalsTable.id, id));
    if (!approval) return res.status(404).json({ error: "Not found" });
    res.json(formatApproval(approval));
  } catch (err) {
    req.log.error({ err }, "Failed to get approval");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/approvals/:id/approve", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body as { notes?: string };

    const [approval] = await db
      .update(approvalsTable)
      .set({
        status: "approved",
        notes: notes ?? null,
        resolvedBy: "Current User",
        resolvedAt: new Date(),
      })
      .where(eq(approvalsTable.id, id))
      .returning();

    if (!approval) return res.status(404).json({ error: "Not found" });

    const receiptId = `RCP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const txHash = `0x${crypto.randomBytes(32).toString("hex")}`;
    const signature = crypto.randomBytes(64).toString("base64");

    await db.insert(cryptoReceiptsTable).values({
      receiptId,
      transactionHash: txHash,
      documentName: approval.contractName,
      requestedBy: approval.requestedBy,
      approvedBy: "Current User",
      signature,
      verificationStatus: "verified",
      approvalId: id,
    });

    const hash = crypto.randomBytes(16).toString("hex");
    await db.insert(auditEventsTable).values({
      user: "Current User",
      agent: "ArmorIQ",
      action: `Approved: ${approval.requestedAction}`,
      status: "executed",
      hash,
      receiptId,
      contractId: approval.contractId,
      contractName: approval.contractName,
      details: notes ?? "Action approved",
    });

    res.json(formatApproval(approval));
  } catch (err) {
    req.log.error({ err }, "Failed to approve action");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/approvals/:id/reject", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { notes } = req.body as { notes?: string };

    const [approval] = await db
      .update(approvalsTable)
      .set({
        status: "rejected",
        notes: notes ?? null,
        resolvedBy: "Current User",
        resolvedAt: new Date(),
      })
      .where(eq(approvalsTable.id, id))
      .returning();

    if (!approval) return res.status(404).json({ error: "Not found" });

    const hash = crypto.randomBytes(16).toString("hex");
    await db.insert(auditEventsTable).values({
      user: "Current User",
      agent: "ArmorIQ",
      action: `Rejected: ${approval.requestedAction}`,
      status: "blocked",
      hash,
      contractId: approval.contractId,
      contractName: approval.contractName,
      details: notes ?? "Action rejected",
    });

    res.json(formatApproval(approval));
  } catch (err) {
    req.log.error({ err }, "Failed to reject action");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
