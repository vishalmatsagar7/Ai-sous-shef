import React, { useEffect, useState } from "react";

const COOKING_TIPS = [
  "Always taste as you go 👨‍🍳",
  "Room temperature ingredients cook more evenly 🌡️",
  "A sharp knife is safer than a dull one 🔪",
  "Season in layers for better flavor 🧂",
  "Read the whole recipe before starting 📖",
  "Fresh herbs add the most flavor at the end 🌿",
  "Don't overcrowd the pan 🍳",
  "Let meat rest before cutting 🥩",
];

export default function LoadingState({ message }: { message: string }) {
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % COOKING_TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 animate-fadeIn">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "3px solid var(--light-gray)",
          }}
        />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            border: "3px solid transparent",
            borderTopColor: "var(--sage)",
            borderRightColor: "var(--sage-light)",
          }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🍳</span>
        </div>
      </div>

      {/* Message */}
      <p
        className="text-base font-semibold text-center mb-2"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
      >
        {message}
      </p>

      {/* Tip card */}
      <div
        className="mt-6 rounded-xl px-4 py-3 text-center max-w-xs w-full"
        style={{
          background: "var(--warm-white)",
          border: "1px solid var(--light-gray)",
          minHeight: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          className="text-xs transition-opacity duration-500"
          style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
        >
          💡 Tip: {COOKING_TIPS[tipIdx]}
        </p>
      </div>
    </div>
  );
}