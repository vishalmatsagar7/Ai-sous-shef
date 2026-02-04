import React, { useEffect, useState } from "react";

interface HeroProps {
  onStart: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

export default function Hero({ onStart, onViewHistory, hasHistory }: HeroProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          width: 380,
          height: 380,
          background: "var(--sage-light)",
          top: "-80px",
          right: "-100px",
        }}
      />
      <div
        className="absolute rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "var(--terracotta-light)",
          bottom: "-60px",
          left: "-80px",
        }}
      />
      <div
        className="absolute rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: "var(--gold-light)",
          top: "40%",
          left: "60%",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-md w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--sage-light), var(--sage))",
              boxShadow: "0 8px 32px rgba(122,158,126,0.3)",
            }}
          >
            <span className="text-4xl">🍳</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl leading-tight mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
        >
          Your AI
          <span style={{ color: "var(--sage-dark)", fontStyle: "italic" }}> Sous Chef</span>
        </h1>

        {/* Subhead */}
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Snap your fridge. Get smart recipes. Cook with confidence — powered by Google Gemini.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
            boxShadow: "0 6px 24px rgba(122,158,126,0.35)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Scan My Fridge
        </button>

        {/* History Button */}
        {hasHistory && (
           <button
           onClick={onViewHistory}
           className="w-full mt-3 py-3 rounded-2xl font-medium text-sm tracking-wide transition-all duration-300 hover:bg-black/5"
           style={{
             color: "var(--charcoal)",
             border: "1px solid var(--light-gray)",
             fontFamily: "'DM Sans', sans-serif",
           }}
         >
           📂 View Past Fridges
         </button>
        )}

        {/* Feature pills */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {["📸 Scan", "🍽️ Recipes", "👨‍🍳 Live Help"].map((pill) => (
            <span
              key={pill}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "var(--warm-white)",
                color: "var(--warm-gray)",
                border: "1px solid var(--light-gray)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}