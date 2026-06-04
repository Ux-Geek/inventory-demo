import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronRight, Zap, RefreshCw } from "lucide-react";
import PageContainer from "./layout/PageContainer";

interface ScannerProps {
  onRecordSaved: () => void;
  onNavigate: (tab: any) => void;
}

export default function Scanner({ onRecordSaved, onNavigate }: ScannerProps) {
  const [mode, setMode] = useState<"camera" | "form">("camera");
  const [flash, setFlash] = useState(false);
  
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand: "Apple",
    model: "",
    storage: "128GB",
    color: "",
    imei: "",
    purchasePrice: "",
    sellerPrice: "",
    supplier: "",
    quantity: "1",
    condition: "New"
  });

  const handleSnap = () => {
    setFlash(true);
    // Play a subtle sound effect for luxury feel if audio was allowed, simulating visually for now
    setTimeout(() => {
      setFlash(false);
      setMode("form");
    }, 150);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        purchasePrice: Number(formData.purchasePrice),
        sellerPrice: Number(formData.sellerPrice),
        quantity: Number(formData.quantity)
      };

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");
      
      onRecordSaved();
      onNavigate("inventory");
    } catch (e) {
      console.error(e);
      alert("Failed to save record.");
    } finally {
      setIsSaving(false);
    }
  };

  // The Camera UI Mode
  if (mode === "camera") {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col justify-between overflow-hidden touch-none select-none">
        {/* Flash Effect Overlay */}
        <AnimatePresence>
          {flash && (
            <motion.div 
              initial={{ opacity: 1 }} 
              animate={{ opacity: 0 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none" 
            />
          )}
        </AnimatePresence>

        {/* Top Controls */}
        <div className="flex justify-between items-center p-6 text-white pt-12">
          <button onClick={() => onNavigate("dashboard")} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <X size={24} />
          </button>
          <button className="p-2">
            <Zap size={24} className="text-yellow-400 fill-yellow-400" />
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="flex-1 relative flex items-center justify-center p-8">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[40px] border-2 border-white/20 overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-[40px]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-[40px]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-[40px]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-[40px]" />
            
            {/* Scanning Laser Animation */}
            <motion.div 
              animate={{ y: ["0%", "100%", "0%"] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-yellow-400/50 shadow-[0_0_10px_2px_rgba(250,204,21,0.5)]"
              style={{ top: "0%" }}
            />
            
            {/* Center Reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-white/20 rounded-xl" />
            </div>
            
            <p className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm font-medium tracking-widest uppercase">
              Align Barcode / IMEI
            </p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="pb-12 pt-4 px-6 flex flex-col items-center gap-8">
          <div className="flex gap-6 text-xs font-bold tracking-widest text-white/50 uppercase">
            <span>STOCKTAKE</span>
            <span className="text-yellow-400">ADD STOCK</span>
            <span>RECEIPT</span>
          </div>
          
          <div className="flex justify-between items-center w-full max-w-sm px-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Camera size={20} className="text-white" />
            </div>
            
            {/* Shutter Button */}
            <button 
              onClick={handleSnap}
              className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-95 active:scale-90 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
            </button>
            
            <button 
              onClick={() => setMode("form")}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs border border-white/20"
            >
              SKIP
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The Data Entry Form Mode (slide up from camera)
  return (
    <PageContainer title="Device Details" subtitle="Stock Intake">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl mx-auto"
      >
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Device Captured</h3>
                    <p className="text-muted text-sm">Please confirm specifications.</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Brand & Model</label>
                  <div className="flex gap-4">
                    <select 
                      className="w-1/3 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="e.g. iPhone 15 Pro"
                      className="w-2/3 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Storage</label>
                    <select 
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.storage}
                      onChange={e => setFormData({...formData, storage: e.target.value})}
                    >
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Natural Titanium"
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.color}
                      onChange={e => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">IMEI / Serial (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Scan or type 15 digits"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-mono tracking-widest"
                    value={formData.imei}
                    onChange={e => setFormData({...formData, imei: e.target.value})}
                  />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.model}
                  className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-title-2 mb-2">Acquisition Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Purchase Cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 font-semibold text-muted">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-black/5 dark:bg-white/5 rounded-xl pl-8 pr-4 py-4 outline-none font-semibold"
                        value={formData.purchasePrice}
                        onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Selling Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 font-semibold text-muted">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-black/5 dark:bg-white/5 rounded-xl pl-8 pr-4 py-4 outline-none font-semibold"
                        value={formData.sellerPrice}
                        onChange={e => setFormData({...formData, sellerPrice: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Supplier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dubai Wholesale"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                    value={formData.supplier}
                    onChange={e => setFormData({...formData, supplier: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Condition</label>
                    <select 
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.condition}
                      onChange={e => setFormData({...formData, condition: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="UK Used">UK Used</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-black/5 dark:bg-white/5 py-4 rounded-xl font-bold cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || !formData.sellerPrice}
                    className="w-2/3 bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                  >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : "Save to Inventory"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </PageContainer>
  );
}
