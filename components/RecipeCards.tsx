import React, { useState } from "react";
import { Recipe, Ingredient } from "../types";

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Easy: { bg: "rgba(74,158,92,0.1)", color: "#4a9e5c" },
  Medium: { bg: "rgba(201,169,110,0.12)", color: "#a08040" },
  Hard: { bg: "rgba(224,64,64,0.1)", color: "#e04040" },
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
    <div className="animate-fadeUp flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
          {recipes.length} Recipes Found
        </p>
        <button
          onClick={onRegenerateRecipes}
          className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{
            background: "var(--light-gray)",
            color: "var(--warm-gray)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          🔄 Regenerate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {recipes.map((recipe, idx) => {
            const isExpanded = expandedIdx === idx;
            const diffStyle = DIFFICULTY_STYLES[recipe.difficulty] || DIFFICULTY_STYLES.Easy;

            return (
            <div
                key={idx}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'lg:col-span-2 row-span-2' : ''}`}
                style={{
                background: "var(--warm-white)",
                border: "1px solid var(--light-gray)",
                boxShadow: isExpanded ? "var(--card-hover)" : "var(--card)",
                }}
            >
                {/* Card Header */}
                <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className="w-full text-left p-4"
                >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "var(--light-gray)" }}
                    >
                        {recipe.emoji || "🍽️"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold truncate" style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}>
                        {recipe.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                            ⏱️ {recipe.time}
                        </span>
                        <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                            background: diffStyle.bg,
                            color: diffStyle.color,
                            fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {recipe.difficulty}
                        </span>
                        {recipe.uses_expiring && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(201,169,110,0.12)", color: "#a08040", fontFamily: "'DM Sans', sans-serif" }}>
                            ♻️ Uses expiring
                            </span>
                        )}
                        </div>
                    </div>
                    </div>
                    {/* Chevron */}
                    <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--warm-gray)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                    <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>

                {/* Match Score Bar */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--light-gray)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                        width: `${getMatchPercent(recipe.match_score)}%`,
                        background: "linear-gradient(90deg, var(--sage-light), var(--sage))",
                        }}
                    />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--sage-dark)", fontFamily: "'DM Sans', sans-serif" }}>
                    {recipe.match_score} match
                    </span>
                </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                <div className="px-4 pb-4 flex flex-col gap-4" style={{ borderTop: "1px solid var(--light-gray)", paddingTop: "16px" }}>

                    {/* Missing Ingredients */}
                    {recipe.missing_ingredients?.length > 0 && (
                    <div
                        className="rounded-xl p-3 flex items-start gap-2"
                        style={{ background: "rgba(224,64,64,0.06)", border: "1px solid rgba(224,64,64,0.15)" }}
                    >
                        <span className="text-sm">❌</span>
                        <div>
                        <p className="text-xs font-semibold" style={{ color: "#e04040", fontFamily: "'DM Sans', sans-serif" }}>
                            Missing Ingredients
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "#e04040", fontFamily: "'DM Sans', sans-serif" }}>
                            {recipe.missing_ingredients.join(", ")}
                        </p>
                        </div>
                    </div>
                    )}

                    {/* Steps */}
                    <div>
                    <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                        Steps
                    </p>
                    <div className="flex flex-col gap-2">
                        {recipe.steps?.map((step, i) => (
                        <div key={i} className="flex gap-3">
                            <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                            style={{ background: "var(--sage)", fontFamily: "'DM Sans', sans-serif" }}
                            >
                            {i + 1}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
                            {step}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Tip */}
                    {recipe.tips && (
                    <div
                        className="rounded-xl p-3 flex items-start gap-2"
                        style={{ background: "rgba(122,158,126,0.08)", border: "1px solid rgba(122,158,126,0.2)" }}
                    >
                        <span className="text-sm">💡</span>
                        <p className="text-xs" style={{ color: "var(--sage-dark)", fontFamily: "'DM Sans', sans-serif" }}>
                        {recipe.tips}
                        </p>
                    </div>
                    )}

                    {/* Cook Button */}
                    <button
                    onClick={() => onCook(recipe)}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: "linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))",
                        boxShadow: "0 4px 16px rgba(201,107,79,0.3)",
                        fontFamily: "'DM Sans', sans-serif",
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