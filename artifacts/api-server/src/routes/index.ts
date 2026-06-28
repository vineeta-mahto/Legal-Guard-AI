import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import contractsRouter from "./contracts";
import approvalsRouter from "./approvals";
import auditRouter from "./audit";
import receiptsRouter from "./receipts";
import notificationsRouter from "./notifications";
import teamRouter from "./team";
import assistantRouter from "./assistant";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(contractsRouter);
router.use(approvalsRouter);
router.use(auditRouter);
router.use(receiptsRouter);
router.use(notificationsRouter);
router.use(teamRouter);
router.use(assistantRouter);

export default router;
