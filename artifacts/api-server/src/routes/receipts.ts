import { Router } from "express";
import { db } from "@workspace/db";
import { cryptoReceiptsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function formatReceipt(r: typeof cryptoReceiptsTable.$inferSelect) {
  return {
    ...r,
    timestamp: r.timestamp.toISOString(),
  };
}

router.get("/receipts", async (req, res) => {
  try {
    const receipts = await db
      .select()
      .from(cryptoReceiptsTable)
      .orderBy(desc(cryptoReceiptsTable.timestamp));
    res.json(receipts.map(formatReceipt));
  } catch (err) {
    req.log.error({ err }, "Failed to list receipts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/receipts/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [receipt] = await db
      .select()
      .from(cryptoReceiptsTable)
      .where(eq(cryptoReceiptsTable.id, id));
    if (!receipt) return res.status(404).json({ error: "Not found" });
    res.json(formatReceipt(receipt));
  } catch (err) {
    req.log.error({ err }, "Failed to get receipt");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
