import React from "react";
import { Smartphone } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white border-b border-slate-150/70 px-4.5 py-4 flex justify-between items-center shrink-0 shadow-xs z-20">
      <div className="flex items-center gap-2.5">
        <div className="bg-slate-900 text-white p-2 rounded-xl flex items-center justify-center">
          <Smartphone size={15} />
        </div>
        <div>
          <span className="text-[11px] font-black tracking-widest text-slate-900 uppercase font-header">ASSETLEDGER</span>
          <span className="text-[8px] font-black text-indigo-700 bg-indigo-50 border border-indigo-150 pl-1 pr-1.5 py-0.2 rounded ml-1.5 uppercase tracking-wide">
            SYS-RF
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-[9px] text-[#059669] font-black uppercase bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-1 rounded-full flex items-center gap-1.5 tracking-wider font-extrabold">
          <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
          LIVE REGISTER
        </span>
      </div>
    </header>
  );
}
