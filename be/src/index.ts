import "dotenv/config";
import express from "express";
import cors from "cors";
import { corsOptions } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { isDatabaseConnected } from "./config/database";

import walletRoutes from "./routes/wallets";
import categoryRoutes from "./routes/categories";
import transactionRoutes from "./routes/transactions";
import budgetRoutes from "./routes/budgets";
import exportRoutes from "./routes/export";
import authRoutes from "./routes/auth";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/export", exportRoutes);

// Health check
app.get("/api/health", async (_req, res) => {
  const dbConnected = await isDatabaseConnected();
  res.json({
    success: true,
    status: "ok",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 PBP Finance API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
