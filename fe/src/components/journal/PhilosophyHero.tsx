"use client";

import React, { useState, useEffect } from "react";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Compass,
  Sparkles,
  ShieldCheck,
  Scale,
  PiggyBank,
  GraduationCap,
  HeartPulse,
  Receipt,
  Users,
  HeartHandshake,
} from "lucide-react";

export interface PhilosophyItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const philosophies: PhilosophyItem[] = [
  {
    id: 1,
    title: "Tiền là công cụ, đừng để thành ông chủ",
    description:
      "Tiền phục vụ mục tiêu và cuộc sống của bạn, không phải thước đo giá trị con người hay lý do để đánh đổi sức khỏe, nhân cách.",
    image: "/img/philosophy-1.jpg",
    tag: "Tư duy cốt lõi",
    icon: Compass,
  },
  {
    id: 2,
    title: "Chi tiêu ít hơn số tiền kiếm ra",
    description:
      "Nền tảng của sự ổn định tài chính là giữ chi tiêu nằm trong khả năng thu nhập thực tế và tránh vay mượn cho nhu cầu nhất thời.",
    image: "/img/philosophy-2.jpg",
    tag: "Quy tắc vàng",
    icon: Scale,
  },
  {
    id: 3,
    title: "Ưu tiên nhu cầu thiết yếu trước sở thích",
    description:
      "Tránh mua sắm tùy hứng hay chạy theo trào lưu khi chưa đáp ứng đủ các nhu cầu cơ bản của bản thân và gia đình.",
    image: "/img/philosophy-3.jpg",
    tag: "Quản lý ngân sách",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Luôn có quỹ dự phòng khẩn cấp",
    description:
      "Dành một phần thu nhập cho các tình huống bất ngờ như ốm đau, sửa chữa hay biến cố để không bao giờ rơi vào thế bị động.",
    image: "/img/philosophy-4.jpg",
    tag: "An toàn tài chính",
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: "Tiết kiệm sớm và giữ kỷ luật",
    description:
      "Tích lũy đều đặn từ những khoản nhỏ nhất giúp tạo nền tảng vững chắc cho mục tiêu dài hạn và giảm bớt áp lực tài chính về sau.",
    image: "/img/philosophy-5.jpg",
    tag: "Tích lũy dài hạn",
    icon: PiggyBank,
  },
  {
    id: 6,
    title: "Đầu tư vào bản thân và tri thức",
    description:
      "Dành nguồn lực cho giáo dục, trau dồi kỹ năng chuyên môn và chăm sóc sức khỏe luôn mang lại giá trị sinh lời bền vững nhất.",
    image: "/img/philosophy-6.jpg",
    tag: "Đầu tư giá trị",
    icon: GraduationCap,
  },
  {
    id: 7,
    title: "Không tiết kiệm cực đoan làm hại sức khỏe",
    description:
      "Cắt giảm chi tiêu hợp lý và thông minh; tránh bỏ bữa hoặc chọn sản phẩm kém chất lượng chỉ vì ham rẻ nhất thời.",
    image: "/img/philosophy-7.jpg",
    tag: "Sức khỏe là vốn",
    icon: HeartPulse,
  },
  {
    id: 8,
    title: "Ghi chép và rà soát thu chi đều đặn",
    description:
      "Theo dõi dòng tiền thường nhật giúp bạn nhận diện chính xác các khoản lãng phí và kịp thời điều chỉnh thói quen tiêu dùng.",
    image: "/img/philosophy-8.jpg",
    tag: "Kỷ luật chi tiêu",
    icon: Receipt,
  },
  {
    id: 9,
    title: "Sòng phẳng và thận trọng trong các mối quan hệ",
    description:
      "Rạch ròi và minh bạch chuyện tiền bạc giúp giữ gìn tình cảm bền lâu, đồng thời tránh sự phụ thuộc tài chính thiếu lành mạnh.",
    image: "/img/philosophy-9.jpg",
    tag: "Minh bạch tài chính",
    icon: Users,
  },
  {
    id: 10,
    title: "Biết chia sẻ trong khả năng",
    description:
      "Sử dụng một phần tài chính để giúp đỡ người khó khăn hoặc đóng góp tích cực tạo ra ý nghĩa xã hội mà không ảnh hưởng sự ổn định của mình.",
    image: "/img/philosophy-10.jpg",
    tag: "Giá trị nhân văn",
    icon: HeartHandshake,
  },
];

export default function PhilosophyHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState(false);

  const DURATION = 7500; // 7.5 giây mỗi slide
  const INTERVAL = 100;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % philosophies.length);
          setImgError(false);
          return 0;
        }
        return prev + (INTERVAL / DURATION) * 100;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % philosophies.length);
    setImgError(false);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + philosophies.length) % philosophies.length);
    setImgError(false);
    setProgress(0);
  };

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setImgError(false);
    setProgress(0);
  };

  const current = philosophies[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E3D9] p-6 sm:p-7 shadow-[0_4px_24px_rgba(28,25,23,0.03)] transition-all">
      {/* Nền mờ trang trí biểu tượng Quote */}
      <div className="absolute left-6 -bottom-6 text-[#F4F1EA] pointer-events-none select-none">
        <Quote className="w-32 h-32 opacity-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* CỘT TRÁI: NỘI DUNG TRIẾT LÝ (7 COLS = ~60%) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          {/* Header của Hero */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <IconComponent className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#15803D]">
                  {current.tag}
                </span>
                <span className="text-[11px] font-bold text-[#A8A29E]">
                  {String(currentIndex + 1).padStart(2, "0")} / {philosophies.length}
                </span>
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4F1EA] transition-colors"
                title={isPlaying ? "Tạm dừng" : "Tiếp tục tự động chạy"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4F1EA] transition-colors"
                title="Triết lý trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4F1EA] transition-colors"
                title="Triết lý tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tiêu đề & Diễn giải */}
          <div className="py-2 min-h-[110px] flex flex-col justify-center">
            <h3 className="text-base sm:text-xl font-black text-[#1C1917] tracking-tight leading-snug">
              "{current.title}"
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2.5">
              {current.description}
            </p>
          </div>

          {/* Thanh chỉ báo Indicators (10 thanh) */}
          <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#F4F1EA]">
            <div className="flex items-center gap-1.5 flex-1 max-w-sm">
              {philosophies.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? "w-8 bg-[#E8E3D9]"
                        : "w-2 bg-[#E8E3D9] hover:bg-[#D5CEBF]"
                    }`}
                    title={`Mục ${item.id}: ${item.title}`}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-[#15803D] rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-semibold text-[#A8A29E] shrink-0 hidden sm:inline">
              Tự động đổi sau 7s
            </span>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG HÌNH ẢNH MINH HỌA (5 COLS = ~40%) */}
        <div className="lg:col-span-5 h-full">
          <div className="relative w-full aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden border border-[#E8E3D9] bg-gradient-to-br from-[#FAF7F2] via-white to-[#F4F1EA] shadow-2xs group">
            {/* Hiển thị hình ảnh từ public/img nếu có */}
            {!imgError ? (
              <img
                src={current.image}
                alt={current.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              /* Fallback nghệ thuật khi chưa bỏ ảnh vào: Poster minh họa Botanical Art */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-br from-[#F5F9F6] via-[#FAF7F2] to-[#FAF4EB]">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E3D9] text-[#15803D] flex items-center justify-center shadow-xs mb-3">
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D]">
                  {current.tag}
                </span>
                <p className="text-xs font-bold text-[#1C1917] mt-1 max-w-[220px] line-clamp-2">
                  {current.title}
                </p>
                <span className="text-[10px] text-[#A8A29E] mt-3 bg-white/80 border border-[#E8E3D9] px-2 py-0.5 rounded-full">
                  Đặt ảnh: public{current.image}
                </span>
              </div>
            )}

            {/* Lớp phủ gradient mờ nhẹ ở đáy ảnh để tạo chiều sâu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white/90 drop-shadow-sm flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              <span>Triết lý {current.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
