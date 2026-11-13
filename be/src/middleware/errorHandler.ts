import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors,
    });
    return;
  }

  if (err instanceof Error) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    res.status(status).json({
      success: false,
      error: err.message || "Internal server error",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
