# 💰 PBP Finance - Quản Lý Chi Tiêu Cá Nhân (Personal Finance Tracker)

Hệ thống quản lý tài chính cá nhân Fullstack được xây dựng theo kiến trúc **Monorepo** với 2 thư mục hoàn toàn độc lập: **Backend (`be/`)** và **Frontend (`fe/`)**.

---

## 🏗️ Cấu trúc Dự án (Project Structure)

```text
PBP/
├── be/                          # BACKEND: Express.js + TypeScript + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma        # 4 bảng cốt lõi: Wallet, Category, Transaction, Budget
│   │   └── seed.ts              # Script nạp sẵn 36+ giao dịch mock trong 2 tháng
│   ├── src/
│   │   ├── config/database.ts   # Prisma Client singleton
│   │   ├── services/            # Core logic (CRUD, Transfer atomic, Budget, Forecast)
│   │   ├── routes/              # Express API Routes (Wallets, Transactions, Budgets, CSV)
│   │   ├── middleware/          # CORS, Error handling
│   │   └── index.ts             # Entrypoint server (Cổng 4000)
│   ├── .env.example
│   └── package.json
│
├── fe/                          # FRONTEND: Next.js 16 App Router + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Trang Dashboard tổng quan + Biểu đồ
│   │   │   ├── transactions/    # Lịch sử giao dịch + Bộ lọc + Form thêm mới
│   │   │   ├── budgets/         # Quản lý ngân sách + Cảnh báo chi tiêu
│   │   │   └── layout.tsx       # Layout có Sidebar điều hướng
│   │   ├── components/          # Reusable UI, Charts, Modals, Forms
│   │   ├── lib/api.ts           # Fetch API client kết nối tới Backend
│   │   └── types/               # TypeScript interfaces
│   ├── .env.local.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Chuẩn bị môi trường
- Đảm bảo máy tính đã cài đặt **Node.js** (Khuyên dùng v20+ hoặc mới hơn) và **npm**.
- (Tùy chọn) Database PostgreSQL miễn phí từ [Neon.tech](https://neon.tech) hoặc [Supabase](https://supabase.com).

---

### 2. Khởi chạy Backend (`be/`)

Mở Terminal thứ nhất và di chuyển vào thư mục `be`:

```bash
cd be

# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo file biến môi trường .env (hoặc copy từ .env.example)
# Điền DATABASE_URL của bạn (PostgreSQL) vào file .env:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/pbp_finance?schema=public"

# 3. Tạo Prisma Client
npm run db:generate

# 4. Đẩy schema lên database (Tạo các bảng)
npm run db:push

# 5. Nạp dữ liệu mẫu (Mock 36 giao dịch trong 2 tháng, 2 ví, 8 danh mục, ngân sách)
npm run db:seed

# 6. Khởi động Backend API server (Chạy tại http://localhost:4000)
npm run dev
```

> **Gợi ý kiểm tra API:** Truy cập [http://localhost:4000/api/health](http://localhost:4000/api/health) trên trình duyệt để kiểm tra trạng thái Backend.

---

### 3. Khởi chạy Frontend (`fe/`)

Mở Terminal thứ hai và di chuyển vào thư mục `fe`:

```bash
cd fe

# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo file .env.local nếu cần (Mặc định đã trỏ tới http://localhost:4000)
# NEXT_PUBLIC_API_URL=http://localhost:4000

# 3. Khởi động giao diện Next.js
npm run dev
```

Truy cập trình duyệt tại: **[http://localhost:3000](http://localhost:3000)** để sử dụng ứng dụng!

---

## ✨ Tính Năng Nổi Bật

### 💳 1. Quản lý Ví & Giao dịch
- Quản lý nhiều ví tiền (Tiền mặt, Tài khoản ngân hàng).
- Thêm giao dịch Thu nhập / Chi tiêu theo danh mục.
- **Chuyển tiền nội bộ (Transfer Atomic):** Trừ tiền ví nguồn và cộng tiền ví đích trong một giao dịch cơ sở dữ liệu duy nhất (`prisma.$transaction`), đảm bảo tính nhất quán dữ liệu tuyệt đối.

### 📊 2. Biểu đồ Phân tích (Recharts)
- **Biểu đồ tròn (Pie Chart):** Cơ cấu chi tiêu theo từng danh mục (Ăn uống, Mua sắm, Tiền nhà...).
- **Biểu đồ cột (Bar Chart):** So sánh tương quan Thu nhập vs Chi tiêu theo thời gian.

### 🎯 3. Quản lý Ngân sách & Cảnh báo Vượt mức
- Thiết lập hạn mức chi tiêu cho từng danh mục theo tháng.
- Thanh tiến độ trực quan tự động đổi màu: **Xanh** (<70%) ➔ **Vàng** (70-90%) ➔ **Đỏ** (>90% hoặc vượt ngân sách).
- Banner cảnh báo nổi bật khi danh mục chạm hoặc vượt ngưỡng cho phép.

### 🔮 4. Dự báo Chi tiêu Cuối tháng
- Thuật toán tính toán số tiền chi tiêu trung bình/ngày của tháng hiện tại.
- Nhân với số ngày còn lại để đưa ra con số dự báo tổng chi tiêu cuối tháng giúp người dùng chủ động điều chỉnh thói quen tiêu dùng.

### 📥 5. Xuất Dữ liệu CSV
- Hỗ trợ xuất toàn bộ lịch sử giao dịch ra file CSV chuẩn UTF-8 (tương thích hoàn hảo với Microsoft Excel và Google Sheets) chỉ với một cú click chuột.

---

## 🛠️ Danh Sách API Endpoints (Backend)

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Kiểm tra trạng thái máy chủ |
| **GET** | `/api/wallets` | Lấy danh sách ví & tổng số dư |
| **GET** | `/api/categories` | Lấy danh sách danh mục (có thể lọc `?type=EXPENSE`) |
| **GET** | `/api/transactions` | Lấy lịch sử giao dịch (`?month=11&year=2026&type=...`) |
| **POST** | `/api/transactions` | Tạo giao dịch Thu / Chi mới |
| **POST** | `/api/transactions/transfer` | Chuyển tiền giữa các ví (Atomic Transaction) |
| **DELETE**| `/api/transactions/:id` | Xóa giao dịch và hoàn nguyên số dư |
| **GET** | `/api/transactions/stats/monthly` | Lấy tổng Thu, Chi, Dư ròng theo tháng |
| **GET** | `/api/transactions/stats/by-category` | Lấy thống kê chi tiêu nhóm theo danh mục |
| **GET** | `/api/budgets/status` | Lấy tình trạng ngân sách & % đã sử dụng |
| **POST** | `/api/budgets` | Tạo hoặc cập nhật hạn mức ngân sách |
| **GET** | `/api/budgets/forecast` | Lấy dữ liệu dự báo chi tiêu cuối tháng |
| **GET** | `/api/export/csv` | Tải xuống file CSV lịch sử giao dịch |

