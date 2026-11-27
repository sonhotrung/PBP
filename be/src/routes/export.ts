import { Router, Response, NextFunction } from "express";
import { ExportService } from "../services/export.service";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/export/csv?month=&year=
router.get("/csv", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const csv = await ExportService.generateCSV(month, year, req.userId);

    const filename = month && year
      ? `transactions_${year}_${String(month).padStart(2, "0")}.csv`
      : year
      ? `transactions_${year}.csv`
      : "transactions_all.csv";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
