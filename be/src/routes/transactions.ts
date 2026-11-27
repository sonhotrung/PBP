import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { TransactionService } from "../services/transaction.service";
import { TransactionFilters } from "../types";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const CreateTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  description: z.string().optional(),
  date: z.string().optional(),
  walletId: z.string().min(1),
  toWalletId: z.string().optional(),
  categoryId: z.string().optional(),
});

// GET /api/transactions
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters: TransactionFilters = {
      month: req.query.month ? parseInt(req.query.month as string) : undefined,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      type: req.query.type as TransactionFilters["type"],
      walletId: req.query.walletId as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
    };
    const transactions = await TransactionService.getAll(filters, req.userId);
    res.json({ success: true, data: transactions, count: transactions.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/transactions/stats and /api/transactions/stats/monthly
const handleMonthlyStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const stats = await TransactionService.getMonthlyStats(month, year, req.userId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
router.get("/stats", optionalAuth, handleMonthlyStats);
router.get("/stats/monthly", optionalAuth, handleMonthlyStats);

// GET /api/transactions/by-category and /api/transactions/stats/by-category
const handleByCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await TransactionService.getByCategory(month, year, req.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
router.get("/by-category", optionalAuth, handleByCategory);
router.get("/stats/by-category", optionalAuth, handleByCategory);

// GET /api/transactions/:id
router.get("/:id", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await TransactionService.getById(req.params.id as string, req.userId);
    if (!transaction) {
      res.status(404).json({ success: false, error: "Transaction not found" });
      return;
    }
    res.json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions
router.post("/", optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = CreateTransactionSchema.parse(req.body);
    let transaction;
    if (data.type === "TRANSFER") {
      transaction = await TransactionService.transfer(data, req.userId);
    } else {
      transaction = await TransactionService.create(data, req.userId);
    }
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await TransactionService.delete(req.params.id as string);
    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
