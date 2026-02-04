import React from "react";
import { Preferences } from "../types";

const OPTIONS: Record<string, string[]> = {
  diet: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Keto"],
  cuisine: ["Any", "Italian", "Mexican", "Chinese", "Indian", "Japanese", "American", "Mediterranean", "Thai"],
  skill: ["Beginner", "Intermediate", "Advanced"],
  time: ["Under 15 Min", "Under 30 Min", "Under 1 Hour", "Any"],
};

const LABELS: Record<string, { icon: string; title: string }> = {
  diet: { icon: "🥗", title: "Dietary Restriction" },
  cuisine: { icon: "🌍", title: "Cuisine Style" },
  skill: { icon: "👨‍🍳", title: "Skill Level" },
  time: { icon: "⏱️", title: "Cooking Time" },
};

interface PreferencesPanelProps {
  preferences: Preferences;
  onChange: (prefs: Preferences) => void;
  onGenerate: () => void;
}

export default function PreferencesPanel({ preferences, onChange, onGenerate }: PreferencesPanelProps) {
  const handleSelect = (key: keyof Preferences, value: string) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="animate-fadeUp flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preference Sections */}
        {Object.entries(OPTIONS).map(([key, values]) => (
            <div key={key}>
            {/* Section Label */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">{LABELS[key].icon}</span>
                <p
                className="text-xs font-semibold tracking-wide uppercase"
                style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
                >
                {LABELS[key].title}
                </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
                {values.map((val) => {
                const active = preferences[key as keyof Preferences] === val;
                return (
                    <button
                    key={val}
                    onClick={() => handleSelect(key as keyof Preferences, val)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.96]"
                    style={{
                        background: active
                        ? "linear-gradient(135deg, var(--sage), var(--sage-dark))"
                        : "var(--warm-white)",
                        color: active ? "#fff" : "var(--charcoal)",
                        border: active ? "none" : "1px solid var(--light-gray)",
                        boxShadow: active ? "0 4px 16px rgba(122,158,126,0.3)" : "none",
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                    >
                    {val}
                    </button>
                );
                })}
            </div>
            </div>
        ))}
      </div>

      <div className="border-t border-[var(--light-gray)] pt-6 flex flex-col sm:flex-row gap-4">
        {/* Prioritize Expiring Toggle */}
        <div
            className="flex-1 rounded-2xl p-4 flex items-center justify-between"
            style={{ background: "var(--warm-white)", border: "1px solid var(--light-gray)" }}
        >
            <div className="flex items-center gap-3">
            <span className="text-lg">♻️</span>
            <div>
                <p className="text-sm font-medium" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
                Reduce Food Waste
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                Use expiring items first
                </p>
            </div>
            </div>

            {/* Toggle Switch */}
            <button
            onClick={() => onChange({ ...preferences, prioritizeExpiring: !preferences.prioritizeExpiring })}
            className="relative w-12 h-6.5 rounded-full transition-all duration-300"
            style={{
                background: preferences.prioritizeExpiring ? "var(--sage)" : "var(--light-gray)",
                height: "26px",
            }}
            >
            <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300"
                style={{
                left: preferences.prioritizeExpiring ? "calc(100% - 22px)" : "2px",
                }}
            />
            </button>
        </div>

        {/* Generate Button */}
        <button
            onClick={onGenerate}
            className="flex-1 py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{
            background: "linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))",
            fontFamily: "'DM Sans', sans-serif",
            }}
        >
            🍳 Generate Recipes
        </button>
      </div>
    </div>
  );
}