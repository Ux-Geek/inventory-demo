import React from "react";
import { Printer, ExternalLink, ChevronDown, Bell } from "lucide-react";

interface DesktopHeaderProps {
  className?: string;
}

export default function DesktopHeader({ className = "" }: DesktopHeaderProps) {
  return (
    <header className={`h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 ${className}`}>
      
      {/* Location Selector */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600">
          Location: <span className="text-emerald-700 font-bold">Lekki store</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2 rounded-lg text-sm font-semibold text-slate-700">
          <Printer size={16} />
          Point of Sale
        </button>
        <button className="flex items-center gap-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors px-4 py-2 rounded-lg text-sm font-semibold mr-2">
          Visit store
        </button>
        
        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors ml-2">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Avatar */}
        <button className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 hover:border-transparent transition-all ml-1">
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
