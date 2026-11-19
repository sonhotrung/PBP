"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Compass,
} from "lucide-react";

export interface PhilosophyItem {
  id: number;
  title: string;
  description: string;
}

export const philosophies: PhilosophyItem[] = [
  {
    id: 1,
    title: "Tiền là công cụ, đừng để thành ông chủ",
    description:
      "Tiền phục vụ mục tiêu và cuộc sống của bạn, không phải thước đo giá trị con người hay lý do để đánh đổi sức khỏe, nhân cách.",
  },
  {
    id: 2,
    title: "Chi tiêu ít hơn số tiền kiếm ra",
    description:
      "Nền tảng của sự ổn định tài chính là giữ chi tiêu nằm trong khả năng thu nhập thực tế và tránh vay mượn cho nhu cầu nhất thời.",
  },
  {
    id: 3,
    title: "Ưu tiên nhu cầu thiết yếu trước sở thích",
    description:
      "Tránh mua sắm tùy hứng hay chạy theo trào lưu khi chưa đáp ứng đủ các nhu cầu cơ bản của bản thân và gia đình.",
  },
  {
    id: 4,
    title: "Luôn có quỹ dự phòng khẩn cấp",
    description:
      "Dành một phần thu nhập cho các tình huống bất ngờ như ốm đau, sửa chữa hay biến cố để không bao giờ rơi vào thế bị động.",
  },
  {
    id: 5,
    title: "Tiết kiệm sớm và giữ kỷ luật",
    description:
      "Tích lũy đều đặn từ những khoản nhỏ nhất giúp tạo nền tảng vững chắc cho mục tiêu dài hạn và giảm bớt áp lực tài chính về sau.",
  },
  {
    id: 6,
    title: "Đầu tư vào bản thân và tri thức",
    description:
      "Dành nguồn lực cho giáo dục, trau dồi kỹ năng chuyên môn và chăm sóc sức khỏe luôn mang lại giá trị sinh lời bền vững nhất.",
  },
  {
    id: 7,
    title: "Không tiết kiệm cực đoan làm hại sức khỏe",
    description:
      "Cắt giảm chi tiêu hợp lý và thông minh; tránh bỏ bữa hoặc chọn sản phẩm kém chất lượng chỉ vì ham rẻ nhất thời.",
  },
  {
    id: 8,
    title: "Ghi chép và rà soát thu chi đều đặn",
    description:
      "Theo dõi dòng tiền thường nhật giúp bạn nhận diện chính xác các khoản lãng phí và kịp thời điều chỉnh thói quen tiêu dùng.",
  },
  {
    id: 9,
    title: "Sòng phẳng và thận trọng trong các mối quan hệ",
    description:
      "Rạch ròi và minh bạch chuyện tiền bạc giúp giữ gìn tình cảm bền lâu, đồng thời tránh sự phụ thuộc tài chính thiếu lành mạnh.",
  },
  {
    id: 10,
    title: "Biết chia sẻ trong khả năng",
    description:
      "Sử dụng một phần tài chính để giúp đỡ người khó khăn hoặc đóng góp tích cực tạo ra ý nghĩa xã hội mà không ảnh hưởng sự ổn định của mình.",
  },
];

export default function PhilosophyHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const DURATION = 7000; // 7 giây mỗi slide
  const INTERVAL = 100;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % philosophies.length);
          return 0;
        }
        return prev + (INTERVAL / DURATION) * 100;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % philosophies.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + philosophies.length) % philosophies.length);
    setProgress(0);
  };

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const current = philosophies[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E3D9] p-6 sm:p-7 shadow-[0_4px_24px_rgba(28,25,23,0.03)] transition-all">
      {/* Nền mờ trang trí biểu tượng Quote */}
      <div className="absolute right-4 -bottom-4 text-[#F4F1EA] pointer-events-none select-none">
        <Quote className="w-28 h-28 opacity-60" />
      </div>

      {/* Header của Hero */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4F1EA] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#15803D]">
              Triết lý tài chính
            </span>
            <span className="text-[11px] font-bold text-[#A8A29E]">
              {String(currentIndex + 1).padStart(2, "0")} / {philosophies.length}
            </span>
          </div>
        </div>

        {/* Nút điều khiển Prev, Play/Pause, Next */}
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

      {/* Nội dung Triết lý */}
      <div className="py-4 sm:py-5 min-h-[105px] flex flex-col justify-center relative z-10">
        <h3 className="text-base sm:text-lg font-black text-[#1C1917] tracking-tight">
          "{current.title}"
        </h3>
        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2 max-w-3xl">
          {current.description}
        </p>
      </div>

      {/* Thanh chỉ báo Indicators (10 thanh) */}
      <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#F4F1EA] relative z-10">
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
          Tự động đổi sau 7s • Bấm để chọn mục
        </span>
      </div>
    </div>
  );
}
