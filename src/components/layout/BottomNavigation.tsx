import React from "react";
import { Home, Archive, BarChart2, Sliders } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "dashboard" | "scanner" | "inventory" | "analytics" | "system";
  setActiveTab: (tab: "dashboard" | "scanner" | "inventory" | "analytics" | "system") => void;
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <nav className="bg-white border-t border-slate-150/70 px-3.5 py-2.5 flex justify-between items-center gap-1 shrink-0 z-40 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] select-none">
      {/* Home / Console */}
      <button
        id="tab_nav_dashboard"
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
          activeTab === "dashboard" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
        }`}
      >
        <Home size={18} className={activeTab === "dashboard" ? "scale-105 text-[#00875a]" : ""} />
        <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
      </button>

      {/* Products / Catalog */}
      <button
        id="tab_nav_inventory"
        onClick={() => setActiveTab("inventory")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
          activeTab === "inventory" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
        }`}
      >
        <Archive size={18} className={activeTab === "inventory" ? "scale-105 text-[#00875a]" : ""} />
        <span className="text-[9px] font-bold uppercase tracking-wider">Products</span>
      </button>

      {/* Metrics / Analytics */}
      <button
        id="tab_nav_analytics"
        onClick={() => setActiveTab("analytics")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
          activeTab === "analytics" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
        }`}
      >
        <BarChart2 size={18} className={activeTab === "analytics" ? "scale-105 text-[#00875a]" : ""} />
        <span className="text-[9px] font-bold uppercase tracking-wider">Metrics</span>
      </button>

      {/* More / System config */}
      <button
        id="tab_nav_system"
        onClick={() => setActiveTab("system")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
          activeTab === "system" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
        }`}
      >
        <Sliders size={18} className={activeTab === "system" ? "scale-105 text-[#00875a]" : ""} />
        <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
      </button>
    </nav>
  );
}
