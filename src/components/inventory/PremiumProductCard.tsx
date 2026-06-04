import React from "react";
import { PhoneRecord } from "../../types";

interface PremiumProductCardProps {
  key?: string | number;
  item: PhoneRecord;
  onClick: (item: PhoneRecord) => void;
}

export default function PremiumProductCard({ item, onClick }: PremiumProductCardProps) {
  return (
    <div 
      onClick={() => onClick(item)}
      className="glass-card group cursor-pointer overflow-hidden flex flex-col md:flex-row h-full md:h-64 relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Product Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-full bg-slate-50 dark:bg-black/20 flex items-center justify-center p-8 relative overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.model} 
          className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out" 
          referrerPolicy="no-referrer"
        />
        {/* Status Tag */}
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md ${
            item.status === "In Stock" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
            item.status === "Reserved" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
            item.status === "Low Stock" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
            "bg-slate-500/10 text-slate-600 border-slate-500/20"
          }`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between z-10 relative">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted mb-2 block">
            {item.brand}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {item.model}
          </h2>
          <p className="text-sm text-muted mt-2 font-medium">
            {item.storage} • {item.ram || "8GB"} • {item.color}
          </p>
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-slate-100 dark:border-white/5 pt-6">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-1">
              Selling Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg text-muted">$</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {(item.sellerPrice || item.estimatedValue).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-1">
              Stock
            </span>
            <span className="text-xl font-medium text-slate-800 dark:text-white/80">
              {item.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
