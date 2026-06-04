import React from "react";
import { PhoneRecord } from "../../types";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";

interface AlertsSectionProps {
  inventory: PhoneRecord[];
  onNavigate: (tab: any) => void;
}

export default function AlertsSection({ inventory, onNavigate }: AlertsSectionProps) {
  const lowStockItems = inventory.filter(i => i.status === "Low Stock" || i.quantity <= 1);
  const poorCondition = inventory.filter(i => i.condition === "Poor" || i.condition === "Fair");

  if (lowStockItems.length === 0 && poorCondition.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold mb-6 tracking-tight">Attention Required</h3>
      <div className="flex flex-col gap-4">
        
        {lowStockItems.length > 0 && (
          <div 
            onClick={() => onNavigate("inventory")}
            className="glass-card p-5 flex items-center justify-between cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Low Stock Alert</h4>
                <p className="text-sm text-muted mt-0.5">{lowStockItems.length} devices are running low.</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-muted group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {poorCondition.length > 0 && (
          <div 
            onClick={() => onNavigate("inventory")}
            className="glass-card p-5 flex items-center justify-between cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Pending Repairs</h4>
                <p className="text-sm text-muted mt-0.5">{poorCondition.length} devices need inspection or repair.</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-muted group-hover:translate-x-1 transition-transform" />
          </div>
        )}

      </div>
    </section>
  );
}
