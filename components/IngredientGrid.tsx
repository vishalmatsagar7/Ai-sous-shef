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

const FRESHNESS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  Fresh: { bg: "rgba(74,158,92,0.1)", color: "#4a9e5c", dot: "#4a9e5c" },
  "Use Soon": { bg: "rgba(201,169,110,0.12)", color: "#a08040", dot: "#c9a96e" },
  Expired: { bg: "rgba(224,64,64,0.1)", color: "#e04040", dot: "#e04040" },
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
    <div className="animate-fadeUp max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        
        {/* Left Column: Fridge Photo & Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            {fridgeImage && (
                <div className="rounded-2xl overflow-hidden border border-[var(--light-gray)] shadow-sm relative group h-48 md:h-64">
                    <img 
                        src={fridgeImage} 
                        alt="Your Fridge" 
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <p className="text-white font-medium text-sm flex items-center gap-2">
                            📸 Your Fridge Scan
                        </p>
                    </div>
                </div>
            )}

            <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "var(--warm-white)", border: "1px solid var(--light-gray)" }}
            >
                <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}>
                    {ingredients.length}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                    ingredients found
                </p>
                </div>
                <button
                onClick={onRescan}
                className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{
                    background: "var(--light-gray)",
                    color: "var(--warm-gray)",
                    fontFamily: "'DM Sans', sans-serif",
                }}
                >
                🔄 Rescan
                </button>
            </div>
            
            {/* Expiring Soon Warning - Mobile: Top, Desktop: Left Col */}
             {expiringSoon.length > 0 && (
                <div
                className="rounded-2xl p-3.5 flex items-start gap-3"
                style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)" }}
                >
                <span className="text-lg">⚠️</span>
                <div>
                    <p className="text-xs font-semibold" style={{ color: "#a08040", fontFamily: "'DM Sans', sans-serif" }}>
                    Use these soon
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#a08040", fontFamily: "'DM Sans', sans-serif" }}>
                    {expiringSoon.map((i) => i.name).join(", ")}
                    </p>
                </div>
                </div>
            )}
            
             <button
                onClick={onContinue}
                className="w-full py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{
                background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
                fontFamily: "'DM Sans', sans-serif",
                }}
            >
                Find Recipes →
            </button>
        </div>

        {/* Right Column: Ingredient Grid */}
        <div className="flex-1 flex flex-col gap-6">
            {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
                {/* Category Label */}
                <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{CATEGORY_ICONS[category] || "📦"}</span>
                <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                    {category}
                </p>
                <span className="text-xs" style={{ color: "var(--warm-gray)" }}>({items.length})</span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map((item, idx) => {
                    const style = FRESHNESS_STYLES[item.freshness] || FRESHNESS_STYLES.Fresh;
                    return (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-3 rounded-xl transition-all"
                        style={{
                        background: "var(--warm-white)",
                        border: "1px solid var(--light-gray)",
                        }}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                        {/* Freshness Dot */}
                        <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: style.dot }}
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
                            {item.name}
                            </p>
                            {item.freshness_note && (
                            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                                {item.freshness_note}
                            </p>
                            )}
                        </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                         <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                            background: style.bg,
                            color: style.color,
                            fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {item.freshness}
                        </span>
                        <span className="text-xs" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
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