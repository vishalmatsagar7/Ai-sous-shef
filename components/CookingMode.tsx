import React, { useState, useRef } from "react";
import { Recipe, Ingredient, Feedback, Substitution } from "../types";
import { getCookingFeedback, getSubstitution } from "../services/geminiService";
import CameraCapture from "./CameraCapture";

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  Perfect: { bg: "rgba(74,158,92,0.1)", color: "#4a9e5c", icon: "✅" },
  Good: { bg: "rgba(74,158,92,0.08)", color: "#4a9e5c", icon: "👍" },
  "Needs Adjustment": { bg: "rgba(201,169,110,0.12)", color: "#a08040", icon: "⚠️" },
  "Wrong Step": { bg: "rgba(224,64,64,0.1)", color: "#e04040", icon: "❌" },
};

interface CookingModeProps {
  recipe: Recipe;
  allIngredients: Ingredient[];
}

export default function CookingMode({ recipe, allIngredients }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [substitution, setSubstitution] = useState<Substitution | null>(null);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [selectedMissing, setSelectedMissing] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = recipe.steps || [];
  const progress = ((currentStep) / Math.max(steps.length - 1, 1)) * 100;

  // ─── COOKING FEEDBACK ─────────────────────────────────
  const handlePhotoUpload = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setIsFeedbackLoading(true);
    setFeedback(null);

    try {
      const base64 = await fileToBase64(file);
      const data = await getCookingFeedback(base64, recipe.name, steps[currentStep]);
      setFeedback(data);
    } catch (err) {
      setFeedback({ status: "Error", feedback: "Failed to get feedback. Try again.", warning: null, next_action: "", encouragement: "" });
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  // ─── SUBSTITUTION ─────────────────────────────────────
  const handleGetSubstitution = async (missingItem: string) => {
    setIsSubLoading(true);
    setSubstitution(null);
    setSelectedMissing(missingItem);

    try {
      const data = await getSubstitution(recipe.name, missingItem, allIngredients);
      setSubstitution(data);
    } catch {
      setSubstitution({ 
        original_ingredient: missingItem,
        substitute: "",
        amount_adjustment: "",
        taste_impact: "",
        texture_impact: "",
        confidence: "Low",
        error: "Failed to find substitution." 
      });
    } finally {
      setIsSubLoading(false);
    }
  };

  const statusStyle = feedback?.status ? (STATUS_STYLES[feedback.status] || STATUS_STYLES["Good"]) : null;

  return (
    <div className="animate-fadeUp flex flex-col gap-4">
      {showCamera && (
        <CameraCapture 
          onCapture={(file) => {
            handlePhotoUpload(file);
          }} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      {/* Recipe Title */}
      <div className="text-center">
        <h2 className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: "var(--charcoal)" }}>
          {recipe.emoji} {recipe.name}
        </h2>
        <p className="text-xs mt-1" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
          ⏱️ {recipe.time} · {recipe.difficulty}
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "var(--light-gray)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--sage-light), var(--sage))",
            }}
          />
        </div>
      </div>

      {/* Current Step Card */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--warm-white)", border: "1px solid var(--light-gray)" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "var(--sage)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {currentStep + 1}
          </div>
          <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
            {steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setFeedback(null); }}
          disabled={currentStep === 0}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
          style={{
            background: "var(--light-gray)",
            color: "var(--charcoal)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setFeedback(null); }}
          disabled={currentStep === steps.length - 1}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Next →
        </button>
      </div>

      {/* ─── AI FEEDBACK SECTION ── */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "var(--warm-white)", border: "1px solid var(--light-gray)" }}
      >
        <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
          📸 Get AI Feedback
        </p>
        <p className="text-xs mb-3" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
          Take a photo of your cooking and the AI chef will check if you're on track.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              background: "var(--light-gray)",
              color: "var(--charcoal)",
              border: "1px dashed var(--warm-gray)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            📁 Upload
          </button>
          <button
            onClick={() => setShowCamera(true)}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              background: "var(--warm-white)",
              color: "var(--charcoal)",
              border: "1px solid var(--sage)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            📷 Camera
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
        />

        {/* Loading */}
        {isFeedbackLoading && (
          <div className="mt-3 flex items-center justify-center gap-2 py-3">
            <div className="w-4 h-4 border-2 border-sage border-t-transparent rounded-full animate-spin-slow" style={{ borderColor: "var(--sage)", borderTopColor: "transparent" }} />
            <p className="text-xs" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>Analyzing your cooking...</p>
          </div>
        )}

        {/* Feedback Result */}
        {feedback && !isFeedbackLoading && statusStyle && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.color}22` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{statusStyle.icon}</span>
              <p className="text-xs font-semibold" style={{ color: statusStyle.color, fontFamily: "'DM Sans', sans-serif" }}>
                {feedback.status}
              </p>
            </div>
            <p className="text-xs" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
              {feedback.feedback}
            </p>
            {feedback.warning && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: "#e04040", fontFamily: "'DM Sans', sans-serif" }}>
                ⚠️ {feedback.warning}
              </p>
            )}
            {feedback.next_action && (
              <p className="text-xs mt-1.5" style={{ color: "var(--sage-dark)", fontFamily: "'DM Sans', sans-serif" }}>
                👉 {feedback.next_action}
              </p>
            )}
            {feedback.encouragement && (
              <p className="text-xs mt-1" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
                {feedback.encouragement}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ─── SUBSTITUTION SECTION ── */}
      {recipe.missing_ingredients?.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--warm-white)", border: "1px solid var(--light-gray)" }}
        >
          <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
            🔄 Missing Ingredients — Find Substitutes
          </p>
          <div className="flex flex-wrap gap-2">
            {recipe.missing_ingredients.map((item, i) => (
              <button
                key={i}
                onClick={() => handleGetSubstitution(item)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: selectedMissing === item && substitution ? "var(--sage)" : "var(--light-gray)",
                  color: selectedMissing === item && substitution ? "#fff" : "var(--charcoal)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {isSubLoading && (
            <div className="mt-3 flex items-center gap-2 py-2">
              <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin-slow" style={{ borderColor: "var(--sage)", borderTopColor: "transparent" }} />
              <p className="text-xs" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>Finding a substitute...</p>
            </div>
          )}

          {substitution && !isSubLoading && !substitution.error && (
            <div
              className="mt-3 rounded-xl p-3"
              style={{ background: "rgba(122,158,126,0.08)", border: "1px solid rgba(122,158,126,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">✅</span>
                <p className="text-xs font-semibold" style={{ color: "var(--sage-dark)", fontFamily: "'DM Sans', sans-serif" }}>
                  Use <span style={{ color: "var(--charcoal)" }}>{substitution.substitute}</span> instead
                </p>
              </div>
              <p className="text-xs" style={{ color: "var(--charcoal)", fontFamily: "'DM Sans', sans-serif" }}>
                Amount: {substitution.amount_adjustment}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
                Taste: {substitution.taste_impact} · Texture: {substitution.texture_impact}
              </p>
              {substitution.step_adjustment && (
                <p className="text-xs mt-1" style={{ color: "var(--sage-dark)", fontFamily: "'DM Sans', sans-serif" }}>
                  📝 {substitution.step_adjustment}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── COMPLETED ── */}
      {currentStep === steps.length - 1 && (
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg, rgba(122,158,126,0.1), rgba(74,158,92,0.15))", border: "1px solid rgba(122,158,126,0.3)" }}
        >
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--sage-dark)" }}>
            You're on the last step!
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}>
            Plate it up and enjoy your meal!
          </p>
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}