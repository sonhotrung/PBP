import { Router, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/wallets (Yêu cầu đăng nhập)
router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const wallets = await WalletService.getAllWallets(req.userId);
    const totalBalance = await WalletService.getTotalBalance(req.userId);
    res.json({ success: true, data: wallets, totalBalance });
  } catch (err) {
    next(err);
  }
});

// GET /api/wallets/total/balance
router.get("/total/balance", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const total = await WalletService.getTotalBalance(req.userId);
    res.json({ success: true, data: { total } });
  } catch (err) {
    next(err);
  }
});

// GET /api/wallets/:id
router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletService.getWalletById(req.params.id as string, req.userId);
    if (!wallet) {
      res.status(404).json({ success: false, error: "Wallet not found" });
      return;
    }
    res.json({ success: true, data: wallet });
  } catch (err) {
    next(err);
  }
});

export default router;
