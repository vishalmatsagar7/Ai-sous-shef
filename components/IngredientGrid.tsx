import React from "react";
import { Ingredient } from "../types";

const CATEGORY_ICONS: Record<string, string> = {
  Vegetables: "🥦",
  Fruits: "🍎",
  Dairy: "🧀",
  Protein: "🥩",
  Grains: "🌾",
  Spices: "🌶️",
  Other: "📦",
};

// Updated to a Purple/Violet Spectrum
const FRESHNESS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  Fresh: { 
    bg: "rgba(124, 58, 237, 0.15)", 
    color: "#7c3aed", 
    dot: "#8b5cf6" 
  },
  "Use Soon": { 
    bg: "rgba(167, 139, 250, 0.2)", 
    color: "#6d28d9", 
    dot: "#a78bfa" 
  },
  Expired: { 
    bg: "rgba(192, 38, 211, 0.15)", 
    color: "#a21caf", 
    dot: "#d946ef" 
  },
};

interface IngredientGridProps {
  ingredients: Ingredient[];
  fridgeImage?: string;
  onRescan: () => void;
  onContinue: () => void;
}

export default function IngredientGrid({ ingredients, fridgeImage, onRescan, onContinue }: IngredientGridProps) {
  // Group by category
  const grouped = ingredients.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const expiringSoon = ingredients.filter(
    (i) => i.freshness === "Expired" || i.freshness === "Use Soon"
  );

  return (
    <div className="animate-fadeUp max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        
        {/* Left Column: Fridge Photo & Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
            {fridgeImage && (
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(124,58,237,0.2)] relative group h-56 md:h-72">
                    <img 
                        src={fridgeImage} 
                        alt="Your Fridge" 
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent flex items-end p-6">
                        <p className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                            Live Scan Analysis
                        </p>
                    </div>
                </div>
            )}

            <div
                className="rounded-3xl p-6 flex items-center justify-between shadow-xl bg-white border border-indigo-50"
            >
                <div>
                <p className="text-4xl font-black font-serif text-indigo-950">
                    {ingredients.length}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-1">
                    Ingredients
                </p>
                </div>
                <button
                onClick={onRescan}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-50 text-indigo-600 bg-indigo-50/50"
                >
                🔄 Rescan
                </button>
            </div>
            
            {/* Expiring Soon - Styled Purple */}
             {expiringSoon.length > 0 && (
                <div
                className="rounded-3xl p-5 flex items-start gap-4 bg-gradient-to-br from-fuchsia-50 to-violet-50 border border-fuchsia-100 shadow-lg shadow-fuchsia-100/50"
                >
                <span className="text-2xl animate-bounce">💜</span>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-1">
                    Chef's Priority
                    </p>
                    <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                    Let's use the <span className="text-fuchsia-600">{expiringSoon.map((i) => i.name).join(", ")}</span> first!
                    </p>
                </div>
                </div>
            )}
            
             <button
                onClick={onContinue}
                className="w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-indigo-200"
                style={{
                  background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
                }}
            >
                Get Recipes →
            </button>
        </div>

        {/* Right Column: Ingredient Grid */}
        <div className="flex-1 flex flex-col gap-8">
            {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="animate-fadeIn">
                {/* Category Label - Styled as Bold Purple Capsule */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-100">
                        <span className="text-lg">{CATEGORY_ICONS[category] || "📦"}</span>
                        <p className="text-[11px] font-black uppercase tracking-widest">
                            {category}
                        </p>
                    </div>
                    <div className="h-px flex-1 bg-indigo-100" />
                    <span className="text-xs font-black text-indigo-300">{items.length} items</span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                {items.map((item, idx) => {
                    const style = FRESHNESS_STYLES[item.freshness] || FRESHNESS_STYLES.Fresh;
                    return (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group bg-white border border-indigo-50 shadow-sm"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Freshness Indicator */}
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                                style={{ 
                                    background: style.dot,
                                    boxShadow: `0 0 12px ${style.dot}88`
                                }}
                            />
                            <div className="min-w-0">
                                <p className="text-[15px] font-bold text-indigo-950 truncate group-hover:text-violet-600 transition-colors">
                                    {item.name}
                                </p>
                                {item.freshness_note && (
                                    <p className="text-[10px] font-medium text-indigo-300 truncate mt-0.5">
                                        {item.freshness_note}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                            <span
                                className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                                style={{
                                    background: style.bg,
                                    color: style.color,
                                }}
                            >
                                {item.freshness}
                            </span>
                            <span className="text-[11px] font-bold text-indigo-400">
                                {item.quantity}
                            </span>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}