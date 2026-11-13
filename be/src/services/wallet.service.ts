import { prisma } from "../config/database";

export class WalletService {
  static async getAllWallets() {
    return prisma.wallet.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  static async getWalletById(id: string) {
    return prisma.wallet.findUnique({
      where: { id },
    });
  }

  static async getTotalBalance(): Promise<number> {
    const wallets = await prisma.wallet.findMany({
      select: { balance: true },
    });
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }

  static async updateBalance(id: string, delta: number) {
    return prisma.wallet.update({
      where: { id },
      data: { balance: { increment: delta } },
    });
  }
}
