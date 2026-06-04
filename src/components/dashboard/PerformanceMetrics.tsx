import React from "react";
import { PhoneRecord } from "../../types";

interface PerformanceMetricsProps {
  inventory: PhoneRecord[];
}

export default function PerformanceMetrics({ inventory }: PerformanceMetricsProps) {
  // Mock data for sales since we don't have historical sales data yet
  const profitMargin = 24.5;
  const todaysSales = 1250;
  
  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold mb-6 tracking-tight">Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 flex flex-col justify-between">
          <span className="text-muted text-xs font-semibold tracking-widest uppercase mb-4 block">
            Today's Sales
          </span>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-xl text-muted">$</span>
            <span className="text-4xl font-bold tracking-tight">{todaysSales.toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between bg-black text-white dark:bg-white dark:text-black border-transparent">
          <span className="text-white/60 dark:text-black/60 text-xs font-semibold tracking-widest uppercase mb-4 block">
            Average Profit Margin
          </span>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-4xl font-bold tracking-tight">{profitMargin}%</span>
            <span className="text-sm font-medium text-emerald-400 dark:text-emerald-600 ml-2 flex items-center">
              ↑ 2.1%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
