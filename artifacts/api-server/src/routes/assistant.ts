import { Router } from "express";
import { db } from "@workspace/db";
import { chatMessagesTable, approvalsTable, contractsTable, auditEventsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const SENSITIVE_ACTIONS = [
  "send to client",
  "execute contract",
  "share externally",
  "sign contract",
  "send for signature",
  "approve contract",
  "release payment",
  "disclose",
];

function detectSensitiveAction(message: string): string | null {
  const lower = message.toLowerCase();
  return SENSITIVE_ACTIONS.find((a) => lower.includes(a)) ?? null;
}

const RESPONSES = [
  "I have analyzed the contract clauses carefully. The indemnification provision in Section 4.2 is broadly written and could expose your organization to significant liability. I recommend negotiating a cap equal to 12 months of service fees, which is standard industry practice.",
  "Based on my analysis, the limitation of liability clause is missing a mutual cap. Without this, your organization carries unlimited downside risk. The AI confidence for this assessment is 97.3%.",
  "I identified 3 missing clauses in this contract: (1) GDPR/Data Protection Addendum, (2) Force Majeure provision, and (3) Intellectual Property assignment. These are critical for compliance and risk management.",
  "The payment terms in Section 6 require payment within 5 days of invoice, which is unusually short. Standard net terms are 30-45 days. I recommend requesting an amendment to net-30 terms.",
  "Contract analysis complete. Overall risk score: 67/100 (Medium-High). Key concerns: unlimited liability, missing data protection provisions, and unilateral amendment rights held by the counterparty.",
];

let responseIdx = 0;

router.post("/assistant/chat", async (req, res) => {
  try {
    const { message, contractId } = req.body as { message: string; contractId?: number };

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const [userMsg] = await db
      .insert(chatMessagesTable)
      .values({
        role: "user",
        content: message,
        contractId: contractId ?? null,
        isBlocked: false,
        evidenceRefs: "[]",
      })
      .returning();

    const sensitiveAction = detectSensitiveAction(message);

    if (sensitiveAction) {
      let contract = null;
      if (contractId) {
        [contract] = await db
          .select()
          .from(contractsTable)
          .where(eq(contractsTable.id, contractId));
      }

      const [approval] = await db
        .insert(approvalsTable)
        .values({
          contractId: contractId ?? 0,
          contractName: contract?.name ?? "Unknown Contract",
          client: contract?.client ?? "Unknown Client",
          requestedAction: sensitiveAction.charAt(0).toUpperCase() + sensitiveAction.slice(1),
          requestedBy: "Current User",
          reason: `AI assistant was asked to: ${message}`,
          aiExplanation: `ArmorIQ detected a sensitive action request: "${sensitiveAction}". This action requires human approval before execution to maintain governance compliance.`,
          riskScore: 78,
          riskLevel: "high",
          requiredApprover: "Legal Manager",
          estimatedImpact: "High — external disclosure of confidential contract terms",
          status: "pending",
        })
        .returning();

      const hash = crypto.randomBytes(16).toString("hex");
      await db.insert(auditEventsTable).values({
        user: "Current User",
        agent: "ArmorIQ",
        action: `Blocked sensitive action: ${sensitiveAction}`,
        status: "blocked",
        hash,
        contractId: contractId ?? null,
        contractName: contract?.name ?? null,
        details: `Approval request created: #${approval.id}`,
      });

      const [aiMsg] = await db
        .insert(chatMessagesTable)
        .values({
          role: "assistant",
          content: `This action has been blocked by ArmorIQ governance controls. "${sensitiveAction.charAt(0).toUpperCase() + sensitiveAction.slice(1)}" is classified as a sensitive action that requires human approval before execution. An approval request (#${approval.id}) has been created and sent to your Legal Manager for review. You will be notified once a decision is made.`,
          contractId: contractId ?? null,
          isBlocked: true,
          blockedAction: sensitiveAction,
          approvalId: approval.id,
          confidenceScore: 99.9,
          evidenceRefs: JSON.stringify(["ArmorIQ Policy v2.1", "Governance Framework §3.4"]),
        })
        .returning();

      return res.json({
        ...aiMsg,
        timestamp: aiMsg.timestamp.toISOString(),
        evidenceRefs: JSON.parse(aiMsg.evidenceRefs),
      });
    }

    const aiContent = RESPONSES[responseIdx % RESPONSES.length];
    responseIdx++;

    const [aiMsg] = await db
      .insert(chatMessagesTable)
      .values({
        role: "assistant",
        content: aiContent,
        contractId: contractId ?? null,
        isBlocked: false,
        confidenceScore: 92 + Math.random() * 7,
        evidenceRefs: JSON.stringify(["Contract §4.2", "Legal Database Ref #1847", "Precedent Case LG-2024-091"]),
      })
      .returning();

    res.json({
      ...aiMsg,
      timestamp: aiMsg.timestamp.toISOString(),
      evidenceRefs: JSON.parse(aiMsg.evidenceRefs),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send chat message");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/assistant/history", async (req, res) => {
  try {
    const { contractId } = req.query as { contractId?: string };
    let query = db.select().from(chatMessagesTable).$dynamic();
    if (contractId) {
      query = query.where(eq(chatMessagesTable.contractId, Number(contractId)));
    }
    const messages = await query.orderBy(desc(chatMessagesTable.timestamp)).limit(50);
    res.json(
      messages.reverse().map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
        evidenceRefs: JSON.parse(m.evidenceRefs),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get chat history");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
