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

interface LoadingStateProps {
  message: string;
  preview?: string | null;
}

export default function LoadingState({ message, preview }: LoadingStateProps) {
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % COOKING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-fadeIn w-full max-w-2xl mx-auto">
      
      {/* Media Preview with Scanning Effect */}
      {preview ? (
        <div className="relative w-full aspect-video md:aspect-[16/9] mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
           <img 
            src={preview} 
            alt="Scanning" 
            className="w-full h-full object-cover"
          />
          {/* Scanning Overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Scanning Line Animation */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--sage-light)] to-transparent shadow-[0_0_15px_var(--sage)] z-10"
            style={{
              animation: "scanMove 2.5s ease-in-out infinite",
              top: '0%'
            }}
          />
          
          {/* Pulsing Status */}
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Processing Media</span>
          </div>
        </div>
      ) : (
        /* Fallback Spinner if no preview */
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full" style={{ border: "3px solid var(--light-gray)" }} />
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              border: "3px solid transparent",
              borderTopColor: "var(--sage)",
              borderRightColor: "var(--sage-light)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🍳</span>
          </div>
        </div>
      )}

      {/* Progress Message */}
      <div className="text-center mb-8">
        <h3
            className="text-xl md:text-2xl font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
        >
            {message}
        </h3>
        <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
                <div 
                    key={i} 
                    className="w-1.5 h-1.5 rounded-full bg-[var(--sage)]" 
                    style={{ animation: `fadeIn 0.6s infinite alternate ${i * 0.2}s` }}
                />
            ))}
        </div>
      </div>

      {/* Tip card */}
      <div
        className="rounded-2xl px-6 py-4 text-center max-w-sm w-full shadow-sm"
        style={{
          background: "var(--warm-white)",
          border: "1px solid var(--light-gray)",
          minHeight: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--sage-dark)" }}>Pro Tip</p>
        <p
          className="text-sm transition-opacity duration-500 font-medium"
          style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {COOKING_TIPS[tipIdx]}
        </p>
      </div>

      <style>{`
        @keyframes scanMove {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
