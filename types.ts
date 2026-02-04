export interface Ingredient {
  name: string;
  quantity: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Protein' | 'Grains' | 'Spices' | 'Other';
  freshness: 'Fresh' | 'Use Soon' | 'Expired';
  freshness_note?: string;
}

export interface ScanResult {
  ingredients: Ingredient[];
  expiring_soon: string[];
  total_items_found: number;
}

export interface Recipe {
  name: string;
  emoji: string;
  match_score: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uses_expiring: boolean;
  ingredients_used: string[];
  missing_ingredients: string[];
  steps: string[];
  tips: string;
}

export interface RecipeResult {
  recipes: Recipe[];
}

export interface Feedback {
  status: 'Perfect' | 'Good' | 'Needs Adjustment' | 'Wrong Step' | 'Error';
  what_i_see?: string;
  feedback: string;
  warning?: string | null;
  next_action?: string;
  encouragement?: string;
}

export interface Substitution {
  original_ingredient: string;
  substitute: string;
  amount_adjustment: string;
  taste_impact: string;
  texture_impact: string;
  step_adjustment?: string;
  confidence: 'High' | 'Medium' | 'Low';
  error?: string;
}

export interface Preferences {
  diet: string;
  skill: string;
  time: string;
  cuisine: string;
  prioritizeExpiring: boolean;
}

export interface FridgeSession {
  id: string;
  timestamp: number;
  imageThumbnail: string; // Base64 string (resized)
  ingredients: Ingredient[];
  recipes: Recipe[];
  preferences?: Preferences;
}