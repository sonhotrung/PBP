import { prisma } from "../config/database";

export class WalletService {
  static async getAllWallets(userId?: string) {
    if (!userId) {
      const demoUser = await prisma.user.findUnique({ where: { email: "demo@pbp.vn" } });
      if (!demoUser) return [];
      return prisma.wallet.findMany({
        where: { userId: demoUser.id },
        orderBy: { createdAt: "asc" },
      });
    }

    return prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async getWalletById(id: string, userId?: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { id },
    });
    if (!wallet) return null;
    if (userId && wallet.userId && wallet.userId !== userId) return null;
    return wallet;
  }

  static async getTotalBalance(userId?: string): Promise<number> {
    const wallets = await this.getAllWallets(userId);
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }

  static async updateBalance(id: string, delta: number) {
    return prisma.wallet.update({
      where: { id },
      data: { balance: { increment: delta } },
    });
  }
}
