import React from "react";
import { Bell } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-6 pt-6 pb-2 bg-slate-50 shrink-0">
      
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center text-white shadow-sm">
          <span className="font-bold text-lg">G</span>
        </div>
        <span className="font-bold text-lg text-slate-900 tracking-tight">Geoshield</span>
      </div>

      {/* Action Buttons & Profile (Top Right) */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-50"></span>
        </button>

        {/* Avatar */}
        <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-emerald-500 transition-all">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" 
            alt="Profile Avatar" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
      
    </header>
  );
}
