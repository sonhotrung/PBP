import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { BudgetService } from "../services/budget.service";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const UpsertBudgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

// GET /api/budgets?month=&year=
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const budgets = await BudgetService.getAll(month, year, req.userId);
    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
});

// GET /api/budgets/status?month=&year=
router.get("/status", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await BudgetService.getBudgetStatus(month, year, req.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/budgets/forecast?month=&year=
router.get("/forecast", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await BudgetService.getSpendingForecast(month, year, req.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/budgets (upsert)
router.post("/", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = UpsertBudgetSchema.parse(req.body);
    const budget = await BudgetService.upsert(data, req.userId);
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/budgets/:id
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await BudgetService.delete(req.params.id as string);
    res.json({ success: true, message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
