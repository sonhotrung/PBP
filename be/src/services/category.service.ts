import { CategoryType } from "@prisma/client";
import { prisma } from "../config/database";

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  static async getCategoriesByType(type: CategoryType) {
    return prisma.category.findMany({
      where: { type },
      orderBy: { createdAt: "asc" },
    });
  }
}
