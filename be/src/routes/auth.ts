import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  name: z.string().min(2, "Tên hiển thị phải có ít nhất 2 ký tự"),
});

const LoginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// POST /api/auth/register
router.post("/register", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = RegisterSchema.parse(req.body);
    const result = await AuthService.register(validated);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors[0]?.message || "Dữ liệu không hợp lệ" });
      return;
    }
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const result = await AuthService.login(validated);
    res.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors[0]?.message || "Dữ liệu không hợp lệ" });
      return;
    }
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getMe(req.userId!);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
