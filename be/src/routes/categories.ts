import { Router, Request, Response, NextFunction } from "express";
import { CategoryType } from "@prisma/client";
import { CategoryService } from "../services/category.service";

const router = Router();

// GET /api/categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    let categories;
    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
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
