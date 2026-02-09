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
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden bg-cream">
      {/* Background blobs - Recolored to Purple/Magenta/Indigo */}
      <div
        className="absolute rounded-full opacity-30 blur-[100px] pointer-events-none"
        style={{
          width: 450,
          height: 450,
          background: "var(--sage-light)",
          top: "-100px",
          right: "-120px",
        }}
      />
      <div
        className="absolute rounded-full opacity-25 blur-[100px] pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "var(--terracotta-light)",
          bottom: "-80px",
          left: "-100px",
        }}
      />
      <div
        className="absolute rounded-full opacity-20 blur-[80px] pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "var(--gold-light)",
          top: "35%",
          left: "55%",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-md w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Icon with Purple Gradient */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-[2rem] flex items-center justify-center animate-pulse-ring"
            style={{
              background: "linear-gradient(135deg, var(--sage-light), var(--sage))",
              boxShadow: "0 12px 40px rgba(124, 58, 237, 0.4)",
            }}
          >
            <span className="text-5xl drop-shadow-lg">🍳</span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl leading-[1.1] mb-4 font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
        >
          Your AI
          <span style={{ color: "var(--sage)", fontStyle: "italic" }}> Sous Chef</span>
        </h1>

        {/* Subhead */}
        <p
          className="text-lg leading-relaxed mb-10 px-4"
          style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Snap your fridge. Get smart recipes. Cook with confidence — powered by Google Gemini.
        </p>

        {/* CTA Button - Bold Purple */}
        <button
          onClick={onStart}
          className="w-full py-5 rounded-2xl text-white font-bold text-lg tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl"
          style={{
            background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
            boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Scan My Fridge
        </button>

        {/* History Button - Indigo Border */}
        {hasHistory && (
           <button
           onClick={onViewHistory}
           className="w-full mt-4 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:bg-white hover:shadow-md"
           style={{
             color: "var(--sage-dark)",
             border: "2px solid var(--light-gray)",
             fontFamily: "'DM Sans', sans-serif",
           }}
         >
           📂 View Past Fridges
         </button>
        )}

        {/* Feature pills */}
        <div className="flex justify-center gap-3 mt-10 flex-wrap">
          {["📸 Scan", "🍽️ Recipes", "👨‍🍳 Live Help"].map((pill) => (
            <span
              key={pill}
              className="text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-widest"
              style={{
                background: "var(--warm-white)",
                color: "var(--sage-dark)",
                border: "1px solid var(--light-gray)",
                boxShadow: "0 4px 6px rgba(124, 58, 237, 0.05)",
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