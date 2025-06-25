"use client";

import { useEffect, useState } from "react";

export function FloatingElements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {}
      <div
        className="absolute top-20 left-10 text-4xl animate-bounce"
        style={{ animationDelay: "0s" }}>
        🥗
      </div>
      <div
        className="absolute top-40 right-20 text-3xl animate-bounce"
        style={{ animationDelay: "1s" }}>
        🍎
      </div>
      <div
        className="absolute top-60 left-1/4 text-2xl animate-bounce"
        style={{ animationDelay: "2s" }}>
        🥑
      </div>
      <div
        className="absolute top-32 right-1/3 text-3xl animate-bounce"
        style={{ animationDelay: "0.5s" }}>
        🥕
      </div>
      <div
        className="absolute top-80 right-10 text-2xl animate-bounce"
        style={{ animationDelay: "1.5s" }}>
        🍊
      </div>

      {}
      <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-emerald-300 rounded-full animate-pulse opacity-60"></div>
      <div
        className="absolute top-1/2 right-1/4 w-6 h-6 bg-teal-300 rounded-full animate-pulse opacity-40"
        style={{ animationDelay: "1s" }}></div>
      <div
        className="absolute top-3/4 left-1/5 w-3 h-3 bg-cyan-300 rounded-full animate-pulse opacity-50"
        style={{ animationDelay: "2s" }}></div>
    </div>
  );
}
