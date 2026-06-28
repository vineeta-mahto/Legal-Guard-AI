import { pgTable, serial, text, boolean, real, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  contractId: integer("contract_id"),
  isBlocked: boolean("is_blocked").notNull().default(false),
  blockedAction: text("blocked_action"),
  approvalId: integer("approval_id"),
  confidenceScore: real("confidence_score"),
  evidenceRefs: text("evidence_refs").notNull().default("[]"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, timestamp: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
