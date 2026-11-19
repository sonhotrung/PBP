import { Router, Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { CategoryType } from "../types";

const router = Router();
const VALID_TYPES: CategoryType[] = ["INCOME", "EXPENSE", "TRANSFER"];

// GET /api/categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    let categories;
    if (type && VALID_TYPES.includes(type as CategoryType)) {
      categories = await CategoryService.getCategoriesByType(type as CategoryType);
    } else {
      categories = await CategoryService.getAllCategories();
    }
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

export default router;
