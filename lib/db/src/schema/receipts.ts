import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cryptoReceiptsTable = pgTable("crypto_receipts", {
  id: serial("id").primaryKey(),
  receiptId: text("receipt_id").notNull().unique(),
  transactionHash: text("transaction_hash").notNull(),
  documentName: text("document_name").notNull(),
  requestedBy: text("requested_by").notNull(),
  approvedBy: text("approved_by").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  signature: text("signature").notNull(),
  verificationStatus: text("verification_status").notNull().default("verified"),
  approvalId: integer("approval_id"),
});

export const insertCryptoReceiptSchema = createInsertSchema(cryptoReceiptsTable).omit({ id: true, timestamp: true });
export type InsertCryptoReceipt = z.infer<typeof insertCryptoReceiptSchema>;
export type CryptoReceipt = typeof cryptoReceiptsTable.$inferSelect;
