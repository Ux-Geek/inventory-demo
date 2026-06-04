import React from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  MessageCircle, 
  Users, 
  BarChart2, 
  Megaphone, 
  Ticket, 
  ArrowLeftRight, 
  Link, 
  Store 
} from "lucide-react";
import { motion } from "framer-motion";

interface DesktopSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  className?: string;
}

export default function DesktopSidebar({ activeTab, setActiveTab, className = "" }: DesktopSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "sales", label: "Orders", icon: <ShoppingBag size={18} /> },
    { id: "inventory", label: "Products", icon: <Tag size={18} /> },
    { id: "instagram", label: "Instagram DM", icon: <MessageCircle size={18} /> },
    { id: "customers", label: "Customers", icon: <Users size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { id: "marketing", label: "Marketing", icon: <Megaphone size={18} /> },
    { id: "discount", label: "Discount & Coupon", icon: <Ticket size={18} /> },
    { id: "scanner", label: "Transactions", icon: <ArrowLeftRight size={18} /> },
    { id: "apps", label: "Connected Apps", icon: <Link size={18} /> },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex-col h-full overflow-y-auto ${className}`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center text-white">
            <span className="font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Geoshield</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1">
        <span className="text-xs font-bold text-slate-500 mb-3 block px-2">Quick Access</span>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors relative ${
                  isActive 
                    ? "text-emerald-700 bg-emerald-50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-600 rounded-r-full" 
                  />
                )}
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Store Link */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          Store
          <Store size={16} />
        </button>
      </div>
    </aside>
  );
}
