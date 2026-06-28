import { pgTable, serial, text, real, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const approvalsTable = pgTable("approvals", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  contractName: text("contract_name").notNull(),
  client: text("client").notNull(),
  requestedAction: text("requested_action").notNull(),
  requestedBy: text("requested_by").notNull(),
  reason: text("reason").notNull(),
  aiExplanation: text("ai_explanation").notNull(),
  riskScore: real("risk_score").notNull(),
  riskLevel: text("risk_level").notNull(),
  requiredApprover: text("required_approver").notNull(),
  estimatedImpact: text("estimated_impact").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  resolvedBy: text("resolved_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertApprovalSchema = createInsertSchema(approvalsTable).omit({ id: true, createdAt: true, resolvedAt: true });
export type InsertApproval = z.infer<typeof insertApprovalSchema>;
export type Approval = typeof approvalsTable.$inferSelect;
