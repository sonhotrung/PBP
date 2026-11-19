import { Router, Request, Response, NextFunction } from "express";
import { WalletService } from "../services/wallet.service";

const router = Router();

// GET /api/wallets
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const wallets = await WalletService.getAllWallets();
    const totalBalance = await WalletService.getTotalBalance();
    res.json({ success: true, data: wallets, totalBalance });
  } catch (err) {
    next(err);
  }
});

// GET /api/wallets/total/balance
router.get("/total/balance", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await WalletService.getTotalBalance();
    res.json({ success: true, data: { total } });
  } catch (err) {
    next(err);
  }
});

// GET /api/wallets/:id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletService.getWalletById(req.params.id as string);
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
