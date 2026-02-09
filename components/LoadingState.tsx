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
      
      {/* Media Preview with Purple Scanning Effect */}
      {preview ? (
        <div className="relative w-full aspect-video md:aspect-[16/9] mb-12 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(124,58,237,0.3)] border-4 border-white">
           <img 
            src={preview} 
            alt="Scanning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/30 backdrop-blur-[2px]" />
          
          {/* Neon Purple Scanning Line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_25px_var(--terracotta)] z-10"
            style={{
              animation: `scanMove ${3 - (progress / 50)}s ease-in-out infinite`,
              top: '0%'
            }}
          />
          
          {/* Pulsing Status - Indigo Theme */}
          <div className="absolute bottom-6 left-6 bg-indigo-950/80 backdrop-blur-2xl px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-indigo-400/30 shadow-2xl">
            <div className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_12px_#d946ef]" />
            <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Neural Vision Active</span>
          </div>
        </div>
      ) : (
        /* Fallback Spinner - Purple */
        <div className="relative w-28 h-28 mb-12">
          <div className="absolute inset-0 rounded-full" style={{ border: "4px solid var(--light-gray)" }} />
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              border: "4px solid transparent",
              borderTopColor: "var(--sage)",
              borderRightColor: "var(--terracotta)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center animate-bounce">
            <span className="text-5xl drop-shadow-md">👨‍🍳</span>
          </div>
        </div>
      )}

      {/* Advanced Purple Progress Indicator */}
      <div className="relative flex flex-col items-center mb-10">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-40 bg-indigo-500 transition-all duration-700" 
             style={{ transform: `scale(${1 + progress/150})` }} />
        
        <svg className="w-36 h-36 transform -rotate-90 drop-shadow-xl">
          <circle
            cx="72"
            cy="72"
            r={radius + 4}
            stroke="var(--light-gray)"
            strokeWidth="1.5"
            fill="transparent"
            className="opacity-20"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="var(--light-gray)"
            strokeWidth="10"
            fill="transparent"
            className="opacity-30"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="url(#purpleGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              strokeLinecap: "round",
            }}
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--sage)" />
                <stop offset="100%" stopColor="var(--terracotta)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3">
          <div className="flex items-baseline">
            <span 
              className={`text-4xl font-black font-serif transition-all duration-150 ${isUpdating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'}`}
              style={{ 
                color: "var(--charcoal)",
                textShadow: "0 0 20px rgba(124, 58, 237, 0.2)"
              }}
            >
              {Math.floor(progress)}
            </span>
            <span className="text-base font-black opacity-30 ml-0.5">%</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 -mt-1">Quantum Flow</span>
        </div>
      </div>

      {/* Progress Message - Colorful */}
      <div className="text-center mb-12">
        <h3
            className="text-3xl md:text-4xl font-black mb-4 tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}
        >
            {message}
        </h3>
        <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
                <div 
                    key={i} 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ 
                      background: i % 2 === 0 ? "var(--sage)" : "var(--terracotta)",
                      animation: `loadingPulse 1s infinite alternate ${i * 0.2}s`,
                      boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--sage-light)' : 'var(--terracotta-light)'}`
                    }}
                />
            ))}
        </div>
      </div>

      {/* Tip card - Lavender */}
      <div
        className="rounded-[2.5rem] px-10 py-8 text-center max-w-sm w-full shadow-2xl border border-indigo-100 relative overflow-hidden group bg-white"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
        <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3 text-indigo-400">Chef's Wisdom</p>
        <p
          className="text-[17px] leading-relaxed font-bold italic text-indigo-900"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          "{COOKING_TIPS[tipIdx]}"
        </p>
      </div>

      <style>{`
        @keyframes scanMove {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loadingPulse {
          from { opacity: 0.2; transform: scale(0.7) translateY(5px); }
          to { opacity: 1; transform: scale(1.3) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}