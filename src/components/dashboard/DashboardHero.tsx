import React from "react";
import { PhoneRecord } from "../../types";

interface DashboardHeroProps {
  inventory: PhoneRecord[];
}

export default function DashboardHero({ inventory }: DashboardHeroProps) {
  const totalItems = inventory.length;
  const totalValue = inventory
    .filter(item => item.status === "In Stock")
    .reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);

  return (
    <section className="mb-12">
      <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/10 dark:to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-muted text-sm font-semibold tracking-widest uppercase mb-3 block">
              Total Inventory Value
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-medium text-muted">$</span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white">
                {totalValue.toLocaleString()}
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 border-l border-slate-200 dark:border-white/10 pl-6">
            <span className="text-muted text-xs font-semibold tracking-widest uppercase">
              Devices in Stock
            </span>
            <div className="text-4xl font-semibold tracking-tight text-slate-800 dark:text-white/90">
              {totalItems} <span className="text-lg text-muted font-medium">units</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
