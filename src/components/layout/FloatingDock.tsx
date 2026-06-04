import React from "react";
import { Home, Grid, ScanLine, Tag, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingDockProps {
  activeTab: "dashboard" | "inventory" | "scanner" | "sales" | "customers" | "settings";
  setActiveTab: (tab: "dashboard" | "inventory" | "scanner" | "sales" | "customers" | "settings") => void;
}

export default function FloatingDock({ activeTab, setActiveTab }: FloatingDockProps) {
  const tabs = [
    { id: "dashboard", icon: <Home size={20} />, label: "Home" },
    { id: "inventory", icon: <Grid size={20} />, label: "Inventory" },
    { id: "scanner", icon: <ScanLine size={24} />, label: "Add" },
    { id: "sales", icon: <Tag size={20} />, label: "Sales" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="floating-dock px-2 py-2 rounded-full flex items-center gap-1 shadow-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isScanner = tab.id === "scanner";
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out cursor-pointer select-none
                ${isScanner ? "w-14 h-14 bg-black dark:bg-white text-white dark:text-black mx-2 hover:scale-105 active:scale-95 shadow-lg" : 
                  isActive ? "w-12 h-12 text-black dark:text-white" : "w-12 h-12 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }
              `}
            >
              {isActive && !isScanner && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                {tab.icon}
                {isActive && !isScanner && (
                  <motion.div 
                    layoutId="activeTabDot"
                    className="absolute -bottom-3 w-1 h-1 bg-black dark:bg-white rounded-full" 
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
