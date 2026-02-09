import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: string;
  onNavigate: (step: "hero" | "upload" | "history") => void;
}

export default function Sidebar({ isOpen, onClose, currentStep, onNavigate }: SidebarProps) {
  const handleNav = (target: "hero" | "upload" | "history") => {
    onNavigate(target);
    // Only close on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop (Mobile Only) */}
      <div
        className={`fixed inset-0 z-40 bg-indigo-900/30 backdrop-blur-md transition-opacity duration-300 md:hidden no-print ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#fdfcff] shadow-2xl md:shadow-none md:border-r border-indigo-100 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] no-print
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-screen md:block`}
      >
        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-xl">🍳</span>
            </div>
            <span className="font-serif font-bold text-xl text-indigo-950">Sous Chef</span>
          </div>
          {/* Close button - Mobile Only */}
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-indigo-50 transition-colors md:hidden text-indigo-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-5 flex flex-col gap-3">
          <NavItem 
            icon="🏠" 
            label="Home" 
            isActive={currentStep === "hero"} 
            onClick={() => handleNav("hero")} 
          />
          <NavItem 
            icon="📸" 
            label="New Scan" 
            isActive={currentStep === "upload" || currentStep === "scanning"} 
            onClick={() => handleNav("upload")} 
          />
          <NavItem 
            icon="📂" 
            label="History" 
            isActive={currentStep === "history"} 
            onClick={() => handleNav("history")} 
          />
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-8 border-t border-indigo-50">
            <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">
                Engine
            </p>
            <p className="text-xs text-indigo-600 font-bold font-sans">
                Google Gemini 2.0
            </p>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: string; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-bold ${
        isActive
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]"
          : "text-indigo-400 hover:text-indigo-900 hover:bg-indigo-50"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
      {label}
    </button>
  );
}