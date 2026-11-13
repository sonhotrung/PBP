import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BudgetService } from "../services/budget.service";

const router = Router();

const UpsertBudgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

// GET /api/budgets?month=&year=
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const budgets = await BudgetService.getAll(month, year);
    res.json({ success: true, data: budgets });
  } catch (err) {
    next(err);
  }
});

// GET /api/budgets/status?month=&year=
router.get("/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await BudgetService.getBudgetStatus(month, year);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/budgets/forecast?month=&year=
router.get("/forecast", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await BudgetService.getSpendingForecast(month, year);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/budgets (upsert)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = UpsertBudgetSchema.parse(req.body);
    const budget = await BudgetService.upsert(data);
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/budgets/:id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BudgetService.delete(req.params.id as string);
    res.json({ success: true, message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
