import React, { useState, useCallback, useEffect } from "react";
import Hero from "./components/Hero";
import UploadZone from "./components/UploadZone";
import IngredientGrid from "./components/IngredientGrid";
import PreferencesPanel from "./components/PreferencesPanel";
import RecipeCards from "./components/RecipeCards";
import CookingMode from "./components/CookingMode";
import LoadingState from "./components/LoadingState";
import Sidebar from "./components/Sidebar"; // Import Sidebar
import { Ingredient, Recipe, Preferences, FridgeSession } from "./types";
import { scanIngredients, generateRecipes } from "./services/geminiService";

export default function App() {
  // ─── APP STATE ───────────────────────────────────────
  
  const [step, setStep] = useState<"hero" | "history" | "upload" | "scanning" | "ingredients" | "preferences" | "generating" | "recipes" | "cooking">("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
  const [scanningPreview, setScanningPreview] = useState<string | null>(null);

  // Stores all past fridge sessions
  const [history, setHistory] = useState<FridgeSession[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ai_sous_chef_history");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
    return [];
  });

  // The active session (currently interacting with)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Derived active session data
  const session = history.find(s => s.id === currentSessionId);
  const ingredients = session?.ingredients || [];
  const recipes = session?.recipes || [];
  const preferences = session?.preferences || {
    diet: "None",
    skill: "Beginner",
    time: "Under 30 Min",
    cuisine: "Any",
    prioritizeExpiring: true,
  };

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | undefined>(undefined);

  // ─── EFFECTS ─────────────────────────────────────────

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem("ai_sous_chef_history", JSON.stringify(history));
    } catch (e) {
      console.error("Local Storage full, removing oldest items");
      if (history.length > 5) {
        const pruned = history.slice(0, 5);
        setHistory(pruned);
        localStorage.setItem("ai_sous_chef_history", JSON.stringify(pruned));
      }
    }
  }, [history]);

  // Geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`);
        },
        (err) => {
          console.debug("Geolocation access denied or failed", err);
        },
        { timeout: 10000 }
      );
    }
  }, []);

  // ─── HELPERS ───

  const createSession = (base64Image: string, scannedIngredients: Ingredient[]) => {
    const newSession: FridgeSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageThumbnail: base64Image,
      ingredients: scannedIngredients,
      recipes: [],
      preferences: {
        diet: "None",
        skill: "Beginner",
        time: "Under 30 Min",
        cuisine: "Any",
        prioritizeExpiring: true,
      }
    };
    
    setHistory(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const updateSession = (sessionId: string, updates: Partial<FridgeSession>) => {
    setHistory(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
      setStep("history");
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200; // Increased for better scan preview quality
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          resolve(canvas.toDataURL("image/jpeg", 0.8)); 
        };
      };
    });
  };
  
  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      
      video.onloadeddata = () => {
        // Seek to 0.5s to avoid black start frame
        video.currentTime = 0.5;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const scale = MAX_WIDTH / video.videoWidth;
        canvas.width = MAX_WIDTH;
        canvas.height = video.videoHeight * scale;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      
      video.onerror = () => {
        resolve(""); // Fallback empty string if video fails
      };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const getRawBase64 = (dataUrl: string) => {
    return dataUrl.split(",")[1];
  };

  // ─── ACTIONS ─────────────────────────────────────────

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);
    setStep("scanning");

    try {
      let thumbnailDataUrl = "";
      let scanDataBase64 = "";
      let mimeType = file.type;

      if (file.type.startsWith("image/")) {
        thumbnailDataUrl = await compressImage(file);
        setScanningPreview(thumbnailDataUrl); // Set preview for LoadingState
        scanDataBase64 = getRawBase64(thumbnailDataUrl);
        mimeType = "image/jpeg";
      } else if (file.type.startsWith("video/")) {
        thumbnailDataUrl = await generateVideoThumbnail(file);
        setScanningPreview(thumbnailDataUrl); // Set preview for LoadingState
        scanDataBase64 = await fileToBase64(file);
      } else {
        throw new Error("Unsupported file type");
      }
      
      const data = await scanIngredients(scanDataBase64, mimeType);

      if (!data.ingredients) throw new Error("Could not find ingredients");
      
      createSession(thumbnailDataUrl, data.ingredients);
      setStep("ingredients");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to scan. Please try again.");
      setStep("upload");
    } finally {
      // Small delay before clearing preview to avoid flash
      setTimeout(() => setScanningPreview(null), 500);
    }
  }, []);

  const handleUpdatePreferences = (newPrefs: Preferences) => {
    if (currentSessionId) {
      updateSession(currentSessionId, { preferences: newPrefs });
    }
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (!currentSessionId || !session) return;
    
    setError(null);
    setStep("generating");

    try {
      const data = await generateRecipes(ingredients, preferences, location);
      if (!data.recipes) throw new Error("Could not generate recipes");
      updateSession(currentSessionId, { recipes: data.recipes });
      setStep("recipes");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate recipes.");
      setStep("preferences");
    }
  }, [currentSessionId, session, ingredients, preferences, location]);

  const handleStartCooking = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setStep("cooking");
  }, []);

  const loadSession = (id: string) => {
    setCurrentSessionId(id);
    const s = history.find(x => x.id === id);
    if (s && s.recipes.length > 0) {
      setStep("recipes");
    } else {
      setStep("ingredients");
    }
  };

  // ─── NAVIGATION ──────────────────────────────────────
  const handleBack = useCallback(() => {
    const backMap: Record<string, any> = {
      history: "hero",
      upload: "hero",
      ingredients: "upload",
      preferences: "ingredients",
      recipes: "preferences",
      cooking: "recipes",
    };
    setStep(backMap[step] || "hero");
  }, [step]);

  const handleSidebarNavigate = (target: "hero" | "upload" | "history") => {
    setStep(target);
    if (target === "upload") setCurrentSessionId(null);
  };

  // ─── RENDER ──────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar: Persistent on Desktop, Drawer on Mobile */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentStep={step}
        onNavigate={handleSidebarNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-0 transition-all duration-300">
        
        {/* ── HERO ── */}
        {step === "hero" && (
            // Hero handles its own full-screen layout, we just wrap it to respect sidebar
            <div className="flex-1">
                <Hero 
                onStart={() => setStep("upload")} 
                onViewHistory={() => setStep("history")}
                hasHistory={history.length > 0}
                />
            </div>
        )}

        {/* ── HISTORY VIEW ── */}
        {step === "history" && (
            <AppShell step="Your Fridge History" onOpenSidebar={() => setIsSidebarOpen(true)}>
            <div className="animate-fadeUp grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.length === 0 && (
                <div className="col-span-full text-center mt-12">
                    <span className="text-4xl block mb-2">📂</span>
                    <p className="text-gray-500">No history yet.</p>
                    <button onClick={() => setStep("upload")} className="text-[var(--sage-dark)] font-medium mt-2 underline">Start a scan</button>
                </div>
                )}
                {history.map((s) => (
                <div 
                    key={s.id}
                    onClick={() => loadSession(s.id)}
                    className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex gap-4 items-center cursor-pointer hover:shadow-md transition-all relative group"
                >
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={s.imageThumbnail} alt="Fridge" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 font-serif">
                        {new Date(s.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                        {s.ingredients.length} items • {s.recipes.length > 0 ? `${s.recipes.length} recipes` : 'No recipes yet'}
                    </p>
                    </div>
                    <button 
                    onClick={(e) => deleteSession(e, s.id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-2"
                    >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    </button>
                </div>
                ))}
                
                <div className="col-span-full mt-4">
                     <button
                        onClick={() => setStep("upload")}
                        className="w-full md:w-auto md:px-8 py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]"
                        style={{
                            background: "linear-gradient(135deg, var(--sage), var(--sage-dark))",
                        }}
                        >
                        + Scan New Fridge
                    </button>
                </div>
            </div>
            </AppShell>
        )}

        {/* ── UPLOAD ── */}
        {step === "upload" && (
            <AppShell step="Scan Your Fridge" onOpenSidebar={() => setIsSidebarOpen(true)} onBack={handleBack}>
            <div className="max-w-xl mx-auto w-full">
                 <UploadZone onUpload={handleFileUpload} error={error} />
            </div>
            </AppShell>
        )}

        {/* ── SCANNING ── */}
        {step === "scanning" && (
            <AppShell step="Scanning..." onOpenSidebar={() => setIsSidebarOpen(true)}>
            <LoadingState 
              message="Analyzing your ingredients..." 
              preview={scanningPreview}
            />
            </AppShell>
        )}

        {/* ── INGREDIENTS ── */}
        {step === "ingredients" && session && (
            <AppShell step="Your Ingredients" onOpenSidebar={() => setIsSidebarOpen(true)} onBack={() => setStep("history")}>
            <IngredientGrid
                ingredients={ingredients}
                fridgeImage={session.imageThumbnail}
                onRescan={() => setStep("upload")}
                onContinue={() => setStep("preferences")}
            />
            </AppShell>
        )}

        {/* ── PREFERENCES ── */}
        {step === "preferences" && session && (
            <AppShell step="Your Preferences" onOpenSidebar={() => setIsSidebarOpen(true)} onBack={handleBack}>
                <div className="max-w-3xl mx-auto w-full">
                    <PreferencesPanel
                        preferences={preferences}
                        onChange={handleUpdatePreferences}
                        onGenerate={handleGenerateRecipes}
                    />
                </div>
            </AppShell>
        )}

        {/* ── GENERATING ── */}
        {step === "generating" && (
            <AppShell step="Cooking Up..." onOpenSidebar={() => setIsSidebarOpen(true)}>
            <LoadingState message="Finding the perfect recipes for you..." />
            </AppShell>
        )}

        {/* ── RECIPES ── */}
        {step === "recipes" && session && (
            <AppShell step="Your Recipes" onOpenSidebar={() => setIsSidebarOpen(true)} onBack={handleBack}>
            <RecipeCards
                recipes={recipes}
                ingredients={ingredients}
                onCook={handleStartCooking}
                onRegenerateRecipes={() => setStep("preferences")}
            />
            </AppShell>
        )}

        {/* ── COOKING MODE ── */}
        {step === "cooking" && selectedRecipe && session && (
            <AppShell step="Cooking Mode" onOpenSidebar={() => setIsSidebarOpen(true)} onBack={handleBack}>
                 <div className="max-w-3xl mx-auto w-full">
                    <CookingMode recipe={selectedRecipe} allIngredients={ingredients} />
                 </div>
            </AppShell>
        )}

      </div>
    </div>
  );
}

// ─── SHARED SHELL WRAPPER ────────────────────────────────────────
interface AppShellProps {
  step: string;
  onOpenSidebar: () => void;
  onBack?: () => void;
  children?: React.ReactNode;
}

function AppShell({ step, onOpenSidebar, onBack, children }: AppShellProps) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 w-full"
        style={{ background: "rgba(250,247,242,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--light-gray)" }}
      >
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (Hamburger) - Hidden on desktop since sidebar is persistent */}
          <button 
            onClick={onOpenSidebar}
            className="p-1 -ml-1 rounded-lg hover:bg-black/5 transition-colors md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <span
          className="text-sm font-medium tracking-wide truncate max-w-[150px] md:max-w-none"
          style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {step}
        </span>

        <div className="flex items-center gap-2">
            {onBack && (
                 <button
                 onClick={onBack}
                 className="flex items-center gap-1 text-sm transition-colors hover:opacity-70 px-2 py-1 rounded-md hover:bg-black/5"
                 style={{ color: "var(--warm-gray)", fontFamily: "'DM Sans', sans-serif" }}
               >
                 Back
               </button>
            )}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 md:px-8 py-6 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
