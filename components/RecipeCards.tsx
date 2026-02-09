import React, { useState } from "react";
import { Recipe, Ingredient } from "../types";

// Updated to Purple/Indigo system
const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Easy: { bg: "rgba(167, 139, 250, 0.15)", color: "#7c3aed" },
  Medium: { bg: "rgba(124, 58, 237, 0.15)", color: "#6d28d9" },
  Hard: { bg: "rgba(79, 70, 229, 0.15)", color: "#4f46e5" },
};

interface RecipeCardsProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onCook: (recipe: Recipe) => void;
  onRegenerateRecipes: () => void;
}

export default function RecipeCards({ recipes, ingredients, onCook, onRegenerateRecipes }: RecipeCardsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="animate-fadeUp flex flex-col gap-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">
          {recipes.length} Gourmet Matches
        </p>
        <button
          onClick={onRegenerateRecipes}
          className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
        >
          🔄 Tweak Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
        {recipes.map((recipe, idx) => {
            const isExpanded = expandedIdx === idx;
            const diffStyle = DIFFICULTY_STYLES[recipe.difficulty] || DIFFICULTY_STYLES.Easy;

            return (
            <div
                key={idx}
                className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 bg-white border border-indigo-50 ${isExpanded ? 'lg:col-span-2 shadow-[0_30px_60px_rgba(124,58,237,0.15)]' : 'shadow-xl hover:shadow-2xl hover:scale-[1.02]'}`}
            >
                {/* Card Header */}
                <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className="w-full text-left p-6 md:p-8"
                >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5 flex-1">
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner"
                        style={{ background: "var(--cream)" }}
                    >
                        {recipe.emoji || "🍽️"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xl md:text-2xl font-black text-indigo-950 font-serif leading-tight">
                        {recipe.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                            ⏱️ {recipe.time}
                        </span>
                        <span
                            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                            style={{
                            background: diffStyle.bg,
                            color: diffStyle.color,
                            }}
                        >
                            {recipe.difficulty}
                        </span>
                        {recipe.uses_expiring && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-fuchsia-100 text-fuchsia-600 shadow-sm shadow-fuchsia-100">
                                Chef's Choice ♻️
                            </span>
                        )}
                        </div>
                    </div>
                    </div>
                    {/* Chevron */}
                    <div className={`p-2 rounded-full bg-indigo-50 text-indigo-400 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                </div>

                {/* Match Score Bar - Neon Purple/Fuchsia */}
                <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1 h-2 rounded-full bg-indigo-50 overflow-hidden shadow-inner">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                        width: isExpanded ? `${getMatchPercent(recipe.match_score)}%` : '0%',
                        background: "linear-gradient(90deg, var(--sage), var(--terracotta))",
                        boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)"
                        }}
                    />
                    </div>
                    <span className="text-xs font-black text-violet-600 tracking-tighter">
                    {recipe.match_score} MATCH
                    </span>
                </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                <div className="px-8 pb-8 flex flex-col gap-8 animate-fadeIn">
                    <div className="h-px bg-indigo-50" />

                    {/* Missing Ingredients */}
                    {recipe.missing_ingredients?.length > 0 && (
                    <div className="rounded-3xl p-5 flex items-start gap-4 bg-indigo-950/5 border border-indigo-100">
                        <span className="text-xl">🛒</span>
                        <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-indigo-900 mb-1">
                            Grocery List
                        </p>
                        <p className="text-sm text-indigo-600 font-bold">
                            Missing: {recipe.missing_ingredients.join(", ")}
                        </p>
                        </div>
                    </div>
                    )}

                    {/* Steps */}
                    <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-indigo-300 mb-6">
                        Preparation Guide
                    </p>
                    <div className="flex flex-col gap-6">
                        {recipe.steps?.map((step, i) => (
                        <div key={i} className="flex gap-5 group">
                            <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-white shadow-lg transition-transform group-hover:scale-110"
                            style={{ background: "linear-gradient(135deg, var(--sage), var(--sage-dark))" }}
                            >
                            {i + 1}
                            </div>
                            <p className="text-[15px] leading-relaxed text-indigo-950 font-medium">
                            {step}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Tip - Lavender styled */}
                    {recipe.tips && (
                    <div className="rounded-3xl p-6 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 italic">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-xl">💡</span>
                           <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 not-italic">Chef's Secret</p>
                        </div>
                        <p className="text-sm text-indigo-900 leading-relaxed font-bold">
                          "{recipe.tips}"
                        </p>
                    </div>
                    )}

                    {/* Cook Button - Primary Purple */}
                    <button
                    onClick={() => onCook(recipe)}
                    className="w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-fuchsia-100"
                    style={{
                        background: "linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))",
                    }}
                    >
                    👨‍🍳 Start Cooking
                    </button>
                </div>
                )}
            </div>
            );
        })}
      </div>
    </div>
  );
}

function getMatchPercent(score: string) {
  if (!score) return 50;
  const match = score.match(/(\d+)\/(\d+)/);
  if (!match) return 50;
  return Math.round((parseInt(match[1]) / parseInt(match[2])) * 100);
}