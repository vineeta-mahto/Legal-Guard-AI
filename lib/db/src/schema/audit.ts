import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const auditEventsTable = pgTable("audit_events", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  user: text("user").notNull(),
  agent: text("agent").notNull(),
  action: text("action").notNull(),
  status: text("status").notNull(),
  hash: text("hash").notNull(),
  receiptId: text("receipt_id"),
  contractId: integer("contract_id"),
  contractName: text("contract_name"),
  details: text("details"),
});

export const insertAuditEventSchema = createInsertSchema(auditEventsTable).omit({ id: true, timestamp: true });
export type InsertAuditEvent = z.infer<typeof insertAuditEventSchema>;
export type AuditEvent = typeof auditEventsTable.$inferSelect;
