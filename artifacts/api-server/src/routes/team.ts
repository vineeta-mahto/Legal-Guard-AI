import { Router } from "express";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/team", async (req, res) => {
  try {
    const members = await db
      .select()
      .from(teamMembersTable)
      .orderBy(desc(teamMembersTable.joinedAt));
    res.json(
      members.map((m) => ({
        ...m,
        joinedAt: m.joinedAt.toISOString(),
        lastActive: m.lastActive?.toISOString() ?? null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list team members");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/team", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: "name, email, role are required" });
    }
    const [member] = await db
      .insert(teamMembersTable)
      .values({ name, email, role, status: "invited", actionsCount: 0, approvalsCount: 0 })
      .returning();
    res.status(201).json({
      ...member,
      joinedAt: member.joinedAt.toISOString(),
      lastActive: null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to invite team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/team/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to remove team member");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
