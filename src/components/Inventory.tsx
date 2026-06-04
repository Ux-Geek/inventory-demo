import { useState } from "react";
import { Search, Filter, RefreshCw, Trash2, Edit3, Check, Eye, X, Tag, ShieldAlert, BadgeInfo, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneRecord } from "../types";

interface InventoryProps {
  inventory: PhoneRecord[];
  onUpdateInventory: () => void;
}

export default function Inventory({ inventory, onUpdateInventory }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  
  // Selected detail modal
  const [activeItem, setActiveItem] = useState<PhoneRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    sellerPrice: 0,
    status: "In Stock" as "In Stock" | "Sold" | "Reserved",
    condition: "Good" as "Excellent" | "Good" | "Fair" | "Poor",
    specifications: "",
    imei: ""
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Derive filter list
  const brands = ["All", ...Array.from(new Set(inventory.map(item => item.brand).filter(Boolean)))];

  // Filter criteria
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.imei || "").includes(searchTerm);
    
    const matchesBrand = selectedBrand === "All" || item.brand === selectedBrand;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    const matchesCondition = selectedCondition === "All" || item.condition === selectedCondition;

    return matchesSearch && matchesBrand && matchesStatus && matchesCondition;
  });

  // Load edit fields
  const triggerEdit = (item: PhoneRecord) => {
    setActiveItem(item);
    setEditForm({
      sellerPrice: item.sellerPrice || item.estimatedValue || 0,
      status: item.status || "In Stock",
      condition: item.condition || "Good",
      specifications: item.specifications || "",
      imei: item.imei || ""
    });
    setIsEditing(true);
  };

  // View details
  const triggerView = (item: PhoneRecord) => {
    setActiveItem(item);
    setIsEditing(false);
  };

  // Save updates to server
  const handleSaveEdit = async () => {
    if (!activeItem) return;
    setIsSaving(true);
    setItemError(null);

    try {
      const response = await fetch(`/api/inventory/${activeItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error("Failed to update system ledger record.");
      }

      onUpdateInventory();
      setActiveItem(null);
      setIsEditing(false);
    } catch (err: any) {
      setItemError(err.message || "Unknown error during save.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete inventory item
  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to remove item from active stock ledger.");
      }
      onUpdateInventory();
      setDeleteId(null);
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    }
  };

  return (
    <div id="inventory_view" className="flex flex-col gap-4 py-2">
      
      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-header leading-tight">LEDGER BOOKS</h1>
          <p className="text-xs text-slate-400 font-body mt-0.5">Filter, query and modify items currently inside memory vault</p>
        </div>

        {/* Input Text search */}
        <div className="relative">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <Search size={14} />
          </span>
          <input
            id="search_devices_input"
            type="text"
            placeholder="Query brand, model, IMEI or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-505 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white placeholder-slate-400 font-body"
          />
          {searchTerm && (
            <button 
              id="clear_search_btn"
              onClick={() => setSearchTerm("")} 
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-650"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Triple dropdown filter row */}
        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand</span>
            <select
              id="filter_brand_select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 py-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              {brands.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 font-body">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Condition</span>
            <select
              id="filter_condition_select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 py-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="All">All Wear</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-1">Market State</span>
            <select
              id="filter_status_select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 py-2 text-[10px] font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="All">All States</option>
              <option value="In Stock">In Stock</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid count items bar */}
      <div className="flex justify-between items-center px-1 font-body">
        <span className="text-[10px] font-bold text-slate-400">
          SHOWING {filteredInventory.length} OF {inventory.length} LEDGER ENTRIES
        </span>
        {(selectedBrand !== "All" || selectedStatus !== "All" || selectedCondition !== "All" || searchTerm) && (
          <button 
            id="reset_all_filters_btn"
            onClick={() => {
              setSelectedBrand("All");
              setSelectedStatus("All");
              setSelectedCondition("All");
              setSearchTerm("");
            }}
            className="text-[10px] text-indigo-650 hover:underline font-black uppercase tracking-wider"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* INVENTORY ITEM CARDS */}
      <div className="flex flex-col gap-3">
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/60 shadow-xs flex flex-col items-center">
            <div className="p-3 bg-slate-50 rounded-full text-slate-350 border border-slate-100 mb-2">
              <Layers size={20} />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">No units match criteria</h3>
            <p className="text-[11px] text-slate-400 px-4 mt-1 font-body">Try shifting filtering dropdowns or search parameters.</p>
          </div>
        ) : (
          filteredInventory.map((item) => (
            <div
              key={item.id}
              id={`phone_card_${item.id}`}
              className="bg-white rounded-[20px] border border-slate-200/60 overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col"
            >
              {/* Card top bar branding */}
              <div className="flex p-4 gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-150 overflow-hidden shrink-0 relative">
                  <img 
                    src={item.imageUrl} 
                    alt={item.model} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-1 left-1">
                    <span className={`text-[7px] font-black uppercase px-1 py-0.2 rounded-sm text-white ${
                      item.condition === "Excellent" ? "bg-emerald-600" :
                      item.condition === "Good" ? "bg-indigo-600" :
                      item.condition === "Fair" ? "bg-amber-600" : "bg-rose-600"
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {item.brand}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      item.status === "In Stock" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" :
                      item.status === "Reserved" ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50" :
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xs font-black text-slate-800 mt-1.5 truncate leading-tight font-header">{item.model}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold font-body">
                    Finish: {item.color} · Cap: {item.storage}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-900 font-header">$ {item.sellerPrice || item.estimatedValue}</div>
                  {item.estimatedValue && item.sellerPrice > item.estimatedValue && (
                    <div className="text-[8px] text-[#059669] font-black uppercase mt-0.5">
                      +{Math.round(((item.sellerPrice - item.estimatedValue) / item.estimatedValue) * 100)}% MARKUP
                    </div>
                  )}
                  <div className="text-[8px] text-slate-350 mt-1 font-mono tracking-tight font-bold">
                    ID: {item.imei ? item.imei.slice(-4).padStart(15, "*") : "NONE"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50/50 border-t border-slate-100 px-4 py-2.5 flex justify-between items-center gap-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                  INCEPT: {new Date(item.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    id={`view_details_${item.id}`}
                    onClick={() => triggerView(item)}
                    className="p-1 px-2.5 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye size={11} /> Specifications
                  </button>
                  <button
                    id={`edit_details_${item.id}`}
                    onClick={() => triggerEdit(item)}
                    className="p-1 px-2 text-[10px] font-extrabold text-[#4f46e5] hover:text-white border border-indigo-200 bg-white hover:bg-[#4f46e5] rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Edit3 size={10} /> Update
                  </button>
                  <button
                    id={`delete_record_${item.id}`}
                    onClick={() => setDeleteId(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 border border-transparent hover:border-slate-200 rounded-lg transition-all cursor-pointer"
                    title="Remove record"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAILED MODAL / BOTTOM SLIDE UP FOR SPECS AND DETAILS */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center p-3"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-t-[28px] w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl pb-8"
            >
              <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag className="text-slate-800" size={14} />
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider font-header">
                    {isEditing ? "Modify Record" : "Technical Specs"}
                  </h3>
                </div>
                <button 
                  id="close_active_modal"
                  onClick={() => setActiveItem(null)} 
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 flex flex-col gap-4">
                {/* Visual Header */}
                <div className="flex gap-3 items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <img 
                    src={activeItem.imageUrl} 
                    alt={activeItem.model} 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 font-header leading-tight">{activeItem.brand} {activeItem.model}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1 tracking-tight font-body">
                      Finish: {activeItem.color} · Cap: {activeItem.storage}
                    </span>
                  </div>
                </div>

                {itemError && (
                  <div className="bg-rose-50 border border-rose-100/50 text-rose-800 text-xs p-2.5 rounded-xl">
                    {itemError}
                  </div>
                )}

                {!isEditing ? (
                  // VIEW MODE Specs sheet info
                  <div className="flex flex-col gap-4 font-body">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">System IMEI Serial</span>
                      <p className="text-xs font-mono font-bold text-slate-800 mt-1 bg-slate-50 p-2 px-3 rounded-xl border border-slate-200/50 inline-block">
                        {activeItem.imei || "Not cataloged"}
                      </p>
                    </div>

                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Condition Evaluation</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-extrabold text-slate-800">
                          {activeItem.condition} Wear Level
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chip / Motherboard Verified Analytics</span>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/40 mt-1.5 leading-relaxed italic whitespace-pre-line">
                        {activeItem.specifications || "No dynamic technical descriptors detected."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3.5 mt-1">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Market Assessment</span>
                        <p className="text-base font-black text-slate-900 mt-1 font-header">${activeItem.estimatedValue || 0}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Target Selling Price</span>
                        <p className="text-base font-black text-indigo-650 mt-1 font-header">${activeItem.sellerPrice || 0}</p>
                      </div>
                    </div>

                    <button
                      id="edit_modal_trigger"
                      onClick={() => triggerEdit(activeItem)}
                      className="w-full bg-slate-900 hover:bg-black text-white font-extrabold py-3.5 px-4 rounded-xl text-xs mt-3 select-none flex items-center justify-center gap-1 cursor-pointer transition-colors uppercase tracking-wider text-[10px]"
                    >
                      <Edit3 size={11} /> Modify Live Fields
                    </button>
                  </div>
                ) : (
                  // EDIT MODE Forms
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Device Asking Retail Price</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">$</span>
                        <input
                          id="edit_seller_price"
                          type="number"
                          value={editForm.sellerPrice}
                          onChange={(e) => setEditForm({ ...editForm, sellerPrice: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Sales Status</label>
                        <select
                          id="edit_status"
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-705 cursor-pointer focus:bg-white"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Wear Appraisal</label>
                        <select
                          id="edit_condition"
                          value={editForm.condition}
                          onChange={(e) => setEditForm({ ...editForm, condition: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-705 cursor-pointer focus:bg-white"
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Verify IMEI Serial Barcode</label>
                      <input
                        id="edit_imei"
                        type="text"
                        maxLength={15}
                        value={editForm.imei}
                        onChange={(e) => setEditForm({ ...editForm, imei: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-800 focus:bg-white"
                        placeholder="15 digits"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Technical Notes</label>
                      <textarea
                        id="edit_specifications"
                        value={editForm.specifications}
                        onChange={(e) => setEditForm({ ...editForm, specifications: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs resize-none text-slate-700 font-body"
                      />
                    </div>

                    <div className="flex gap-2.5 mt-2 border-t border-slate-100 pt-4">
                      <button
                        id="cancel_edit_btn"
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border border-slate-200 py-3 rounded-xl text-xs font-bold text-slate-650 cursor-pointer"
                      >
                        Back
                      </button>
                      
                      <button
                        id="submit_edit_btn"
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveEdit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {isSaving ? <RefreshCw className="animate-spin text-white" size={11} /> : <Check size={11} />} Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPACT DELETION OVERLAY SHEET */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-5 rounded-3xl w-full max-w-xs text-center flex flex-col items-center gap-3.5 border border-slate-200 shadow-xl"
            >
              <div className="bg-rose-50 text-rose-600 p-3 rounded-full border border-rose-100">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">CONFIRM LEDGER PURGE?</h4>
                <p className="text-[11px] text-slate-450 mt-1 font-body leading-relaxed px-1">This operation deletes the registered cellular resource from the live memory book permanently.</p>
              </div>
              <div className="flex gap-2.5 w-full mt-1.5">
                <button
                  id="cancel_delete_btn"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-105 border border-slate-200 text-slate-650 text-xs font-extrabold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm_delete_btn"
                  onClick={() => deleteId && handleDeleteItem(deleteId)}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
