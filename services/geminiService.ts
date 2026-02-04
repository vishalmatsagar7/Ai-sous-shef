import { GoogleGenAI } from "@google/genai";
import { Ingredient, Recipe, Preferences, Feedback, Substitution, ScanResult, RecipeResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Using gemini-3-flash-preview as recommended for text/reasoning tasks
const MODEL_NAME = "gemini-3-flash-preview";

// ─── PROMPT TEMPLATES ────────────────────────────────────────────

const SCAN_PROMPT = `You are an expert chef and food identification AI. Analyze this image or video carefully.

1. Identify ALL visible ingredients/food items
2. Estimate approximate quantity of each
3. Check freshness (brown spots, wilting, mold)
4. Categorize as: Vegetables, Fruits, Dairy, Protein, Grains, Spices, Other

Return ONLY valid JSON with this schema:
{
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "estimated amount",
      "category": "Vegetables|Fruits|Dairy|Protein|Grains|Spices|Other",
      "freshness": "Fresh|Use Soon|Expired",
      "freshness_note": "short note"
    }
  ],
  "expiring_soon": ["items to use first"],
  "total_items_found": 0
}`;

const RECIPE_PROMPT = (ingredients: string, preferences: Preferences, location?: string) => `You are a world-class chef. Based on these ingredients, suggest 3 recipes.

Ingredients available:
${ingredients}

Preferences:
- Dietary Restriction: ${preferences.diet}
- Skill Level: ${preferences.skill}
- Max Cooking Time: ${preferences.time}
- Preferred Cuisine: ${preferences.cuisine}
- Prioritize expiring items: ${preferences.prioritizeExpiring}
${location ? `- User Location: ${location}` : ''}

Rules:
- Use ONLY the available ingredients (and common pantry staples like oil, salt, pepper).
- If prioritizing expiring items, at least 1 recipe must use them.
- If a specific cuisine is requested, prioritize that style.
- If "Any" cuisine is selected and location is available, you may suggest local regional variations if appropriate.
- Sort by match score.

Return ONLY valid JSON with this schema:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "emoji": "single relevant emoji",
      "match_score": "X/Y",
      "time": "X min",
      "difficulty": "Easy|Medium|Hard",
      "uses_expiring": true,
      "ingredients_used": ["list"],
      "missing_ingredients": ["list"],
      "steps": ["Step 1", "Step 2"],
      "tips": "one tip"
    }
  ]
}`;

const FEEDBACK_PROMPT = (recipeName: string, currentStep: string) => `You are a professional chef watching someone cook. Analyze this photo.

Recipe: ${recipeName}
Current Step: ${currentStep}

1. Analyze what you see
2. Compare to what SHOULD be happening
3. Give specific, actionable feedback

Return ONLY valid JSON with this schema:
{
  "status": "Perfect|Good|Needs Adjustment|Wrong Step",
  "what_i_see": "brief description",
  "feedback": "actionable feedback",
  "warning": "safety concern or null",
  "next_action": "what to do next",
  "encouragement": "short motivational message"
}`;

const SUBSTITUTE_PROMPT = (recipe: string, missing: string, available: string) => `You are a creative chef. The user is missing an ingredient.

Recipe: ${recipe}
Missing Ingredient: ${missing}
Available Ingredients: ${available}

Suggest the best substitution.

Return ONLY valid JSON with this schema:
{
  "original_ingredient": "what was needed",
  "substitute": "what to use instead",
  "amount_adjustment": "how to adjust",
  "taste_impact": "how taste changes",
  "texture_impact": "how texture changes",
  "step_adjustment": "any step changes needed",
  "confidence": "High|Medium|Low"
}`;

// ─── HELPER: parse JSON safely from LLM output ──────────────────

function parseJSON(text: string) {
  try {
    const jsonBlockMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonBlockMatch) {
      return JSON.parse(jsonBlockMatch[1]);
    }
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse AI response.");
  }
}

// ─── EXPORTED API FUNCTIONS ─────────────────────────────────────

export async function scanIngredients(base64Data: string, mimeType: string = "image/jpeg"): Promise<ScanResult> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
        parts: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                },
            },
            { text: SCAN_PROMPT },
        ],
    },
    config: { responseMimeType: "application/json" }
  });
  
  if (!response.text) throw new Error("No response from AI");
  return parseJSON(response.text);
}

export async function generateRecipes(ingredients: Ingredient[], preferences: Preferences, location?: string): Promise<RecipeResult> {
  const ingredientList = ingredients
    .map((i) => `- ${i.name} (${i.quantity}) [${i.freshness}]`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
        parts: [
            {
                text: RECIPE_PROMPT(
                    ingredientList,
                    preferences,
                    location
                  ),
            }
        ]
    },
    config: { responseMimeType: "application/json" }
  });

  if (!response.text) throw new Error("No response from AI");
  return parseJSON(response.text);
}

export async function getCookingFeedback(base64Image: string, recipeName: string, currentStep: string): Promise<Feedback> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
        parts: [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image,
                },
            },
            { text: FEEDBACK_PROMPT(recipeName, currentStep) },
        ]
    },
    config: { responseMimeType: "application/json" }
  });

  if (!response.text) throw new Error("No response from AI");
  return parseJSON(response.text);
}

export async function getSubstitution(recipe: string, missingIngredient: string, availableIngredients: Ingredient[]): Promise<Substitution> {
  const availableList = availableIngredients.map((i) => i.name).join(", ");
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
        parts: [{
            text: SUBSTITUTE_PROMPT(recipe, missingIngredient, availableList),
        }]
    },
    config: { responseMimeType: "application/json" }
  });

  if (!response.text) throw new Error("No response from AI");
  return parseJSON(response.text);
}