import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { RegisterDTO, LoginDTO, AuthResponse } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "pbp_finance_journal_secret_2026_xyz";
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  static async register(data: RegisterDTO): Promise<AuthResponse> {
    const emailNormalized = data.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      throw new Error("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
        name: data.name.trim(),
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(data.name.trim())}`,
      },
    });

    // Tạo sẵn 2 ví mặc định cho người dùng mới
    await prisma.wallet.createMany({
      data: [
        {
          name: "Tài khoản Ngân hàng",
          type: "BANK",
          balance: 0,
          currency: "VND",
          color: "#2563EB",
          userId: user.id,
        },
        {
          name: "Tiền mặt",
          type: "CASH",
          balance: 0,
          currency: "VND",
          color: "#10B981",
          userId: user.id,
        },
      ],
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async login(data: LoginDTO): Promise<AuthResponse> {
    const emailNormalized = data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("Người dùng không tồn tại.");
    }

    return user;
  }
}
