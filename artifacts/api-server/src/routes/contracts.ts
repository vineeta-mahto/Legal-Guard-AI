import { Router } from "express";
import { db } from "@workspace/db";
import {
  contractsTable,
  clausesTable,
  approvalsTable,
  auditEventsTable,
  cryptoReceiptsTable,
} from "@workspace/db";
import { eq, like, and, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function formatContract(c: typeof contractsTable.$inferSelect) {
  return {
    ...c,
    uploadedAt: c.uploadedAt.toISOString(),
    analyzedAt: c.analyzedAt?.toISOString() ?? null,
  };
}

router.get("/contracts", async (req, res) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };
    let query = db.select().from(contractsTable).$dynamic();

    const conditions = [];
    if (status) conditions.push(eq(contractsTable.status, status));
    if (search) conditions.push(like(contractsTable.name, `%${search}%`));
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const contracts = await query.orderBy(desc(contractsTable.uploadedAt));
    res.json(contracts.map(formatContract));
  } catch (err) {
    req.log.error({ err }, "Failed to list contracts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/contracts", async (req, res) => {
  try {
    const { name, client, fileType, fileSize, content } = req.body;
    if (!name || !client || !fileType || !fileSize) {
      return res.status(400).json({ error: "name, client, fileType, fileSize are required" });
    }

    const [contract] = await db
      .insert(contractsTable)
      .values({
        name,
        client,
        fileType,
        fileSize,
        status: "uploaded",
        riskScore: 0,
        riskLevel: "low",
        assignedTo: null,
        summary: null,
      })
      .returning();

    await db.insert(auditEventsTable).values({
      user: "Current User",
      agent: "LegalGuard AI",
      action: `Uploaded contract: ${name}`,
      status: "executed",
      hash: crypto.randomBytes(16).toString("hex"),
      contractId: contract.id,
      contractName: name,
      details: `File: ${fileType}, Size: ${fileSize}`,
    });

    res.status(201).json(formatContract(contract));
  } catch (err) {
    req.log.error({ err }, "Failed to create contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contracts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [contract] = await db
      .select()
      .from(contractsTable)
      .where(eq(contractsTable.id, id));

    if (!contract) return res.status(404).json({ error: "Not found" });

    const clauses = await db
      .select()
      .from(clausesTable)
      .where(eq(clausesTable.contractId, id));

    res.json({
      ...formatContract(contract),
      clauses: clauses.map((c) => ({ ...c, isRisky: c.isRisky === "true" })),
      obligations: [
        "Deliver services within 30 days of execution",
        "Maintain confidentiality of all shared information",
        "Provide monthly progress reports",
      ],
      deadlines: [
        "Service commencement: 2025-02-01",
        "First deliverable: 2025-03-15",
        "Final review: 2025-06-30",
      ],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/contracts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, client, status, assignedTo } = req.body;
    const updates: Partial<typeof contractsTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (client !== undefined) updates.client = client;
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    const [updated] = await db
      .update(contractsTable)
      .set(updates)
      .where(eq(contractsTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(formatContract(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/contracts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(contractsTable).where(eq(contractsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contracts/:id/analysis", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [contract] = await db
      .select()
      .from(contractsTable)
      .where(eq(contractsTable.id, id));

    if (!contract) return res.status(404).json({ error: "Not found" });

    const clauses = await db
      .select()
      .from(clausesTable)
      .where(eq(clausesTable.contractId, id));

    const riskyClauses = clauses
      .filter((c) => c.isRisky === "true")
      .map((c) => ({ ...c, isRisky: true }));

    res.json({
      contractId: id,
      overallRiskScore: contract.riskScore || 65,
      riskLevel: contract.riskLevel || "medium",
      executiveSummary:
        contract.summary ||
        "This contract presents moderate risk. Key concerns include ambiguous liability clauses and missing data protection provisions. The indemnification clause is broadly written and could expose the client to significant financial liability. Recommended actions include negotiating liability caps and adding a GDPR compliance rider.",
      riskyClauses: riskyClauses.length > 0 ? riskyClauses : [
        {
          id: 1,
          contractId: id,
          title: "Unlimited Liability Clause",
          content: "The service provider shall be liable for all direct, indirect, and consequential damages arising from service delivery without limitation.",
          riskLevel: "high",
          isRisky: true,
          aiSuggestion: "Add a liability cap equal to 12 months of service fees. This is standard practice and significantly reduces exposure.",
        },
        {
          id: 2,
          contractId: id,
          title: "Unilateral Amendment Rights",
          content: "The company reserves the right to modify the terms of this agreement at any time without prior notice to the counterparty.",
          riskLevel: "high",
          isRisky: true,
          aiSuggestion: "Require 30-day advance written notice for material amendments and a right to terminate if objected to.",
        },
      ],
      missingClauses: [
        "Data Protection and GDPR Compliance Addendum",
        "Dispute Resolution and Arbitration Clause",
        "Force Majeure Provision",
        "Intellectual Property Ownership",
      ],
      aiSuggestions: [
        "Add a liability cap clause limiting exposure to 12 months of contract value",
        "Include a GDPR/data protection rider to ensure regulatory compliance",
        "Negotiate mutual termination rights with 30-day notice period",
        "Clarify intellectual property ownership for any work product created",
      ],
      confidenceScore: 94.7,
      sensitiveActions: ["Send to Client", "Execute Contract", "Share Externally"],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get contract analysis");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
