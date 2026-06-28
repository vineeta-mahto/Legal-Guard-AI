import { pgTable, serial, text, real, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contractsTable = pgTable("contracts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  client: text("client").notNull(),
  status: text("status").notNull().default("uploaded"),
  riskScore: real("risk_score").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("low"),
  fileType: text("file_type").notNull(),
  fileSize: text("file_size").notNull(),
  assignedTo: text("assigned_to"),
  summary: text("summary"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  analyzedAt: timestamp("analyzed_at"),
});

export const insertContractSchema = createInsertSchema(contractsTable).omit({ id: true, uploadedAt: true, analyzedAt: true });
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contractsTable.$inferSelect;

export const clausesTable = pgTable("clauses", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  riskLevel: text("risk_level").notNull().default("low"),
  isRisky: text("is_risky").notNull().default("false"),
  aiSuggestion: text("ai_suggestion"),
});

export type Clause = typeof clausesTable.$inferSelect;
