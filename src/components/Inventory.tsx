import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { PhoneRecord } from "../types";
import PageContainer from "./layout/PageContainer";
import PremiumProductCard from "./inventory/PremiumProductCard";

interface InventoryProps {
  inventory: PhoneRecord[];
  onUpdateInventory: () => void;
}

export default function Inventory({ inventory, onUpdateInventory }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const brands = ["All", ...Array.from(new Set(inventory.map(item => item.brand).filter(Boolean)))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.imei || "").includes(searchTerm);
    
    const matchesBrand = selectedBrand === "All" || item.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleCardClick = (item: PhoneRecord) => {
    // In Phase 2: Open a beautiful slide-over panel with deep specs and edit controls.
    console.log("View item details", item);
    alert(`Opening details for ${item.model}. Deep edit controls coming in Phase 2!`);
  };

  return (
    <PageContainer title="Inventory" subtitle={`${filteredInventory.length} Devices`}>
      
      {/* Premium Filter & Search Bar */}
      <div className="mb-12 glass-card p-2 pl-6 pr-2 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Search size={18} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search brand, model, or IMEI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium outline-none py-4 dark:text-white"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="p-2 text-muted hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-4 ml-4">
          <Filter size={16} className="text-muted hidden md:block" />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-800 dark:text-white outline-none cursor-pointer p-2 py-3 pr-8 rounded-xl appearance-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {brands.map(b => (
              <option key={b} value={b} className="text-black">{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cinematic Grid */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-muted text-lg">No devices found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredInventory.map(item => (
            <PremiumProductCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      )}
      
    </PageContainer>
  );
}
