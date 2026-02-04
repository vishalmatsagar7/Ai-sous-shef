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
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Tip rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % COOKING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulated progress logic: non-linear and "human-like"
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99;
        const remaining = 100 - prev;
        const increment = Math.max(0.4, Math.random() * (remaining / 12));
        
        // Trigger "pop" animation state
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 150);
        
        return Math.min(prev + increment, 99);
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-fadeIn w-full max-w-2xl mx-auto">
      
      {/* Media Preview with Scanning Effect */}
      {preview ? (
        <div className="relative w-full aspect-video md:aspect-[16/9] mb-12 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
           <img 
            src={preview} 
            alt="Scanning" 
            className="w-full h-full object-cover"
          />
          {/* Scanning Overlay */}
          <div className="absolute inset-0 bg-black/25" />
          
          {/* Scanning Line Animation */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--sage-light)] to-transparent shadow-[0_0_20px_var(--sage)] z-10"
            style={{
              animation: `scanMove ${3 - (progress / 50)}s ease-in-out infinite`,
              top: '0%'
            }}
          />
          
          {/* Pulsing Status */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
            <span className="text-[11px] text-white font-bold uppercase tracking-[0.15em]">Neural Analysis Engine</span>
          </div>
        </div>
      ) : (
        /* Fallback Spinner if no preview */
        <div className="relative w-24 h-24 mb-12">
          <div className="absolute inset-0 rounded-full" style={{ border: "4px solid var(--light-gray)" }} />
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              border: "4px solid transparent",
              borderTopColor: "var(--sage)",
              borderRightColor: "var(--sage-light)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
        </div>
      )}

      {/* Advanced Progress Indicator Container */}
      <div className="relative flex flex-col items-center mb-8">
        {/* Glow Ring Backdrop */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-[var(--sage)] transition-all duration-700" 
             style={{ transform: `scale(${1 + progress/200})` }} />
        
        <svg className="w-32 h-32 transform -rotate-90 drop-shadow-sm">
          {/* Decorative Outer Track */}
          <circle
            cx="64"
            cy="64"
            r={radius + 4}
            stroke="var(--light-gray)"
            strokeWidth="1"
            fill="transparent"
            className="opacity-10"
          />
          {/* Main Background Ring */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="var(--light-gray)"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          {/* Primary Progress Ring with Glow */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="var(--sage)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              strokeLinecap: "round",
              filter: "drop-shadow(0 0 4px var(--sage))"
            }}
          />
        </svg>

        {/* Floating Percentage Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="flex items-baseline">
            <span 
              className={`text-3xl font-black font-serif transition-all duration-150 ${isUpdating ? 'scale-110' : 'scale-100'}`}
              style={{ 
                color: progress > 50 ? "var(--sage-dark)" : "var(--charcoal)",
                textShadow: progress > 80 ? "0 0 10px rgba(122, 158, 126, 0.2)" : "none"
              }}
            >
              {Math.floor(progress)}
            </span>
            <span className="text-sm font-bold opacity-40 ml-0.5">%</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-30 -mt-1">Accuracy</span>
        </div>
      </div>

      {/* Progress Message */}
      <div className="text-center mb-10">
        <h3
            className="text-2xl md:text-3xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
        >
            {message}
        </h3>
        <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
                <div 
                    key={i} 
                    className="w-2 h-2 rounded-full bg-[var(--sage)]" 
                    style={{ 
                      animation: `loadingPulse 0.8s infinite alternate ${i * 0.2}s`,
                      boxShadow: '0 0 8px var(--sage-light)'
                    }}
                />
            ))}
        </div>
      </div>

      {/* Tip card with floating effect */}
      <div
        className="rounded-3xl px-8 py-6 text-center max-w-sm w-full shadow-lg border border-white/50 relative overflow-hidden group"
        style={{
          background: "linear-gradient(to bottom right, #fff, var(--warm-white))",
        }}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--sage)] opacity-20 group-hover:opacity-100 transition-opacity" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--sage-dark)" }}>Chef's Wisdom</p>
        <p
          className="text-[15px] leading-relaxed font-medium italic"
          style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}
        >
          "{COOKING_TIPS[tipIdx]}"
        </p>
      </div>

      <style>{`
        @keyframes scanMove {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loadingPulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
