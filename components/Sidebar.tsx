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
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#faf7f2] shadow-2xl md:shadow-none md:border-r border-[var(--light-gray)] transform transition-transform duration-300 ease-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-screen md:block`} // md:static and md:translate-x-0 make it permanent on desktop
        style={{  }}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-[var(--light-gray)]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍳</span>
            <span className="font-serif font-bold text-lg text-[var(--charcoal)]">AI Sous Chef</span>
          </div>
          {/* Close button - Mobile Only */}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--light-gray)] transition-colors md:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex flex-col gap-2">
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
        <div className="absolute bottom-0 w-full p-6 border-t border-[var(--light-gray)]">
            <p className="text-xs text-[var(--warm-gray)] font-sans">
                Powered by Google Gemini
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
        isActive
          ? "bg-[var(--sage)] text-white shadow-md"
          : "text-[var(--charcoal)] hover:bg-[var(--warm-white)] hover:shadow-sm"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}