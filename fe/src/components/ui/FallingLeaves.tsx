"use client";

import React, { useEffect, useState } from "react";

interface LeafConfig {
  id: number;
  left: number; // % vị trí ngang
  size: number; // px
  duration: number; // giây
  delay: number; // giây
  color: string;
}

export default function FallingLeaves() {
  const [leaves, setLeaves] = useState<LeafConfig[]>([]);

  useEffect(() => {
    // Khởi tạo các chiếc lá an toàn trên client
    const leafColors = [
      "#15803D", // Green 700
      "#16A34A", // Green 600
      "#4ADE80", // Green 400
      "#65A30D", // Lime 600
      "#059669", // Emerald 600
    ];

    const generatedLeaves: LeafConfig[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 96) + 2, // 2% đến 98%
      size: Math.floor(Math.random() * 12) + 16, // 16px đến 28px
      duration: Math.floor(Math.random() * 12) + 16, // 16s đến 28s rơi chầm chậm
      delay: Math.floor(Math.random() * 14), // delay rải rác
      color: leafColors[i % leafColors.length],
    }));

    setLeaves(generatedLeaves);
  }, []);

  if (leaves.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="falling-leaf"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hình chiếc lá thanh mảnh tự nhiên */}
          <path
            d="M20.5 3.5C14.5 4 6 8.5 4 16.5C3.5 18.5 4.5 20.5 6.5 20C14.5 18 19 9.5 20.5 3.5Z"
            fill={leaf.color}
            opacity="0.35"
          />
          <path
            d="M5 19C10.5 13.5 15.5 8.5 20 4"
            stroke={leaf.color}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      ))}
    </div>
  );
}
