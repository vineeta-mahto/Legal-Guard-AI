import { Router } from "express";
import { db } from "@workspace/db";
import { auditEventsTable } from "@workspace/db";
import { eq, like, and, desc, gte, lte } from "drizzle-orm";

const router = Router();

router.get("/audit-trail", async (req, res) => {
  try {
    const { search, status, from, to } = req.query as {
      search?: string;
      status?: string;
      from?: string;
      to?: string;
    };

    const conditions = [];
    if (status) conditions.push(eq(auditEventsTable.status, status));
    if (search) conditions.push(like(auditEventsTable.action, `%${search}%`));
    if (from) conditions.push(gte(auditEventsTable.timestamp, new Date(from)));
    if (to) conditions.push(lte(auditEventsTable.timestamp, new Date(to)));

    let query = db.select().from(auditEventsTable).$dynamic();
    if (conditions.length > 0) query = query.where(and(...conditions));
    const events = await query.orderBy(desc(auditEventsTable.timestamp));

    res.json(
      events.map((e) => ({
        ...e,
        timestamp: e.timestamp.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list audit events");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
