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
  Image as ImageIcon,
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
    <div className="relative overflow-hidden rounded-3xl border border-[#E8E3D9] shadow-[0_8px_30px_rgba(28,25,23,0.08)] min-h-[340px] sm:min-h-[380px] md:min-h-[400px] flex flex-col justify-between p-6 sm:p-8 md:p-10 transition-all group">
      {/* 1. LỚP HÌNH ẢNH NỀN TOÀN BỘ HERO (FULL BACKGROUND) */}
      {!imgError ? (
        <img
          key={current.image}
          src={current.image}
          alt={current.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      ) : (
        /* Fallback nghệ thuật Botanical khi chưa có ảnh trong public/img */
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D281C] via-[#143B29] to-[#1C1917]">
          {/* Subtle luminous spots */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#15803D]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#15803D]/20 blur-3xl pointer-events-none" />
        </div>
      )}

      {/* 2. LỚP PHỦ GRADIENT SCRIM (ĐẢM BẢO CHỮ TRÊN ẢNH LUÔN SẮC NÉT & DỄ ĐỌC) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />

      {/* 3. BIỂU TƯỢNG QUOTE NGHỆ THUẬT MỜ NẰM CHÌM */}
      <div className="absolute right-6 -bottom-8 text-white/5 pointer-events-none select-none">
        <Quote className="w-56 h-56 sm:w-72 sm:h-72" />
      </div>

      {/* 4. NỘI DUNG CHỮ HIỂN THỊ TRỰC TIẾP TRÊN ẢNH (Z-10) */}
      {/* HEADER: TAG, THỨ TỰ & NÚT ĐIỀU KHIỂN */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
            <IconComponent className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>{current.tag}</span>
          </span>
          <span className="text-xs font-bold text-white/75 tracking-wider bg-black/30 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full">
            {String(currentIndex + 1).padStart(2, "0")} / {philosophies.length}
          </span>
        </div>

        {/* Nút điều khiển lướt triết lý */}
        <div className="flex items-center gap-1 bg-black/35 backdrop-blur-md border border-white/20 rounded-2xl p-1 shadow-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title={isPlaying ? "Tạm dừng" : "Tiếp tục chạy tự động"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Triết lý trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
            title="Triết lý tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BODY: TIÊU ĐỀ & DIỄN GIẢI TRIẾT LÝ NẰM TRỰC TIẾP TRÊN NỀN ẢNH */}
      <div className="relative z-10 my-auto py-6 sm:py-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-2 text-[#4ADE80] font-bold text-xs tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span>Triết lý tài chính #{current.id}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-md">
          "{current.title}"
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mt-3 sm:mt-4 font-normal max-w-2xl drop-shadow-sm">
          {current.description}
        </p>
      </div>

      {/* FOOTER: THANH CHỈ BÁO PROGRESS VÀ TRẠNG THÁI */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/15">
        {/* 10 thanh chỉ báo (1 thanh cho mỗi triết lý) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {philosophies.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "w-8 sm:w-12 bg-white/25"
                    : "w-2.5 sm:w-3.5 bg-white/25 hover:bg-white/45"
                }`}
                title={`Mục ${item.id}: ${item.title}`}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 bg-[#4ADE80] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_#4ADE80]"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Thông tin phụ trợ */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
          {imgError && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-white/80">
              <ImageIcon className="w-3 h-3 text-[#4ADE80]" />
              <span>Chưa có ảnh: public{current.image}</span>
            </span>
          )}
          <span className="hidden sm:inline">Tự động chuyển sau 7.5s</span>
        </div>
      </div>
    </div>
  );
}
