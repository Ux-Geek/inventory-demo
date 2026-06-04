import React, { useState, useRef, useEffect } from "react";
import { Camera, Smartphone, Check, AlertCircle, RefreshCw, Upload, Sparkles, ChevronRight, HelpCircle, Lock, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneRecord, AnalysisResult } from "../types";

// High quality preview silhouettes to act as captured device overlays if they want to simulate
const PREVIEW_PRESETS = [
  {
    name: "Apple iPhone 15 Pro",
    brand: "Apple",
    model: "iPhone 15 Pro",
    color: "Natural Titanium",
    storage: "256GB",
    specs: "A17 Pro Titanium frame, Dynamic Island, Triple camera 48MP.",
    value: 899,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanium Gray",
    storage: "512GB",
    specs: "Snapdragon 8 Gen 3, S-Pen included, flat 6.8-inch display, 200MP Quad-Cam.",
    value: 1099,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Google Pixel 8 Pro",
    brand: "Google",
    model: "Pixel 8 Pro",
    color: "Bay Blue",
    storage: "128GB",
    specs: "Google Tensor G3 chip, AI Camera features, Matte finish glass panel.",
    value: 650,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80"
  }
];

interface ScannerProps {
  onRecordSaved: () => void;
  onNavigate: (tab: "dashboard" | "scanner" | "inventory" | "analytics") => void;
}

export default function Scanner({ onRecordSaved, onNavigate }: ScannerProps) {
  // Navigation & Progressive disclosure state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);

  // Form payload states
  const [imei, setImei] = useState<string>("");
  const [imeiError, setImeiError] = useState<string | null>(null);

  // 3 image slot states
  const [photos, setPhotos] = useState<{
    front: string | null;
    back: string | null;
    side: string | null;
  }>({
    front: null,
    back: null,
    side: null
  });
  
  // Active photo slot being captured
  const [activeSlot, setActiveSlot] = useState<"front" | "back" | "side" | null>(null);

  // Specs form states
  const [specs, setSpecs] = useState({
    brand: "Apple",
    model: "iPhone 15 Pro",
    storage: "256GB",
    color: "Natural Titanium",
    specifications: "A17 Pro system-on-chip, dynamic island module, Titanium borders."
  });

  // Pricing form states
  const [evaluation, setEvaluation] = useState({
    condition: "Mint" as "Mint" | "Good" | "Fair" | "For Parts",
    sellerPrice: 750,
    estimatedValue: 700
  });

  // Camera capture states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [netError, setNetError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll effect on step update
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        const targetElement = document.getElementById(`step_card_${currentStep}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [currentStep]);

  // Handle stream initialization
  const startCamera = async (slot: "front" | "back" | "side") => {
    setActiveSlot(slot);
    setNetError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(media);
      setCameraActive(true);
      
      // Delay slightly for DOM rendering of video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
      }, 150);

    } catch (err) {
      console.error("Camera access failed:", err);
      setNetError("Camera not allowed. Please click 'Simulate Snap' to proceed.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Trigger camera capture write
  const capturePhoto = () => {
    if (!videoRef.current || !activeSlot) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      
      const newPhotos = { ...photos, [activeSlot]: dataUrl };
      setPhotos(newPhotos);
      stopCamera();
      
      // Trigger instant AI diagnosis if appropriate
      runGeminiImageAppraisal(dataUrl);
      
      // Auto check transition to step 3
      if (newPhotos.front && newPhotos.back) {
        setTimeout(() => {
          advanceToStep(3);
        }, 1200);
      }
    }
  };

  // Simulated preset loader for desktops or quick testing with realistic images
  const applyPresetSimulate = (preset: typeof PREVIEW_PRESETS[0]) => {
    setPhotos({
      front: preset.image,
      back: preset.image,
      side: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop"
    });
    setSpecs({
      brand: preset.brand,
      model: preset.model,
      storage: preset.storage,
      color: preset.color,
      specifications: preset.specs
    });
    setEvaluation(prev => ({
      ...prev,
      estimatedValue: preset.value,
      sellerPrice: Math.round(preset.value * 1.05)
    }));
    
    // Alert user that preset was applied
    setCurrentStep(3);
    setMaxStepReached(Math.max(maxStepReached, 3));
  };

  // Run Gemini analysis endpoint proxy
  const runGeminiImageAppraisal = async (base64Url: string) => {
    setIsAnalyzing(true);
    setNetError(null);
    try {
      const response = await fetch("/api/analyze-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Url })
      });

      if (!response.ok) {
        throw new Error("Diagnosis failed");
      }
      
      const parsed = await response.json();
      if (parsed.success && parsed.analysis) {
        const ai: AnalysisResult = parsed.analysis;
        setSpecs({
          brand: ai.brand || "Apple",
          model: ai.model || "iPhone Regular",
          storage: ai.suggestedStorage || "128GB",
          color: ai.color || "Gray Space",
          specifications: ai.specifications || "Verified via visual model analytics."
        });
        setEvaluation(prev => ({
          ...prev,
          estimatedValue: Number(ai.estimatedValue) || 600,
          sellerPrice: Number(ai.estimatedValue) ? Math.round(Number(ai.estimatedValue) * 1.05) : 630
        }));
      }
    } catch (e) {
      console.warn("AI appraisal offline or interrupted:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step transitions
  const advanceToStep = (target: number) => {
    setCurrentStep(target);
    setMaxStepReached(prev => Math.max(prev, target));
  };

  // STEP 1 IMEI Validate
  const handleImeiSubmit = (val: string) => {
    const rawDigits = val.replace(/\D/g, "");
    setImei(rawDigits);
    setImeiError(null);

    if (rawDigits.length === 15) {
      // Audio or tactile feedback simulated, advance
      advanceToStep(2);
    } else if (rawDigits.length > 0 && rawDigits.length < 15) {
      setImeiError("IMEI requires exactly 15 numeric digits.");
    }
  };

  const simulateRandomImei = () => {
    // Standard cellular prefix ranges
    const prefix = "35892110";
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
    const result = prefix + suffix;
    setImei(result);
    setImeiError(null);
    // Micro transition
    setTimeout(() => {
      advanceToStep(2);
    }, 600);
  };

  // Commit and write to live storage list
  const handleCommitToLedger = async () => {
    // Map Mint/Good/Fair/For Parts to database condition slots
    let dbCondition: "Excellent" | "Good" | "Fair" | "Poor" = "Good";
    if (evaluation.condition === "Mint") dbCondition = "Excellent";
    if (evaluation.condition === "Good") dbCondition = "Good";
    if (evaluation.condition === "Fair") dbCondition = "Fair";
    if (evaluation.condition === "For Parts") dbCondition = "Poor";

    try {
      const payload = {
        brand: specs.brand,
        model: specs.model,
        color: specs.color,
        storage: specs.storage,
        condition: dbCondition,
        specifications: specs.specifications,
        estimatedValue: Number(evaluation.estimatedValue) || 600,
        sellerPrice: Number(evaluation.sellerPrice) || 650,
        imei: imei,
        imageUrl: photos.front || photos.back || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop",
        status: "In Stock"
      };

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Unable to save item.");
      }

      // Success
      onRecordSaved();
      onNavigate("inventory");
    } catch (e: any) {
      setNetError(e.message || "Failed to commit ledger metadata.");
    }
  };

  return (
    <div ref={scrollContainerRef} className="flex flex-col gap-5 py-2 font-body text-slate-700">
      
      {/* Banner / Header Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 flex flex-col gap-1 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 font-header leading-tight">
          DEVICE INTAKE SYSTEM
        </h1>
        <p className="text-xs text-slate-400 font-body">
          Progressive flow to verify IMEI details, capture photos, and grading
        </p>
      </div>

      {/* STEP 1: THE INTAKE GATE (SCAN) */}
      <div 
        id="step_card_1"
        onClick={() => currentStep > 1 && setCurrentStep(1)}
        className={`bg-white rounded-3xl border transition-all duration-300 p-5 ${
          currentStep === 1 
            ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/20" 
            : "border-slate-100 opacity-60 cursor-pointer hover:opacity-85"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              imei.length === 15 ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
            }`}>
              {imei.length === 15 ? <Check size={12} /> : "1"}
            </span>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 font-header">
              Scan Device Identifier
            </h2>
          </div>
          {imei.length === 15 && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check size={10} /> {imei}
            </span>
          )}
        </div>

        {currentStep === 1 ? (
          <div className="flex flex-col gap-3.5 pt-1">
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Position the phone's barcode or IMEI sticker within the frame. Scanning automatically fetches model details.
            </p>

            {/* Simulated Live Viewfinder Box */}
            <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-slate-800 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
              
              {/* Blue Laser scanner animation */}
              <div className="absolute inset-x-0 h-0.5 bg-cyan-400 opacity-70 animate-[bounce_2.5s_infinite] shadow-[0_0_8px_cyan]" />
              
              {/* Corner brackets graphics */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-indigo-400" />
              <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-indigo-400" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-indigo-400" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-indigo-400" />

              <div className="z-10 flex flex-col items-center gap-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1">
                  <Smartphone size={10} /> Scanner Active
                </span>
                <button
                  id="simulate_barcode_detection_btn"
                  onClick={simulateRandomImei}
                  className="mt-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles size={11} /> Simulate Sticker Read
                </button>
              </div>
            </div>

            {/* Manual user input field */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wide font-bold text-slate-400 pl-1">
                Enter IMEI Manually
              </label>
              <div className="relative">
                <input
                  id="manual_imei_field"
                  type="text"
                  maxLength={15}
                  placeholder="Type 15 Digits Numerical"
                  value={imei}
                  onChange={(e) => handleImeiSubmit(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono tracking-widest focus:outline-none"
                />
                {imei.length === 15 && (
                  <span className="absolute right-3 top-3 text-emerald-500">
                    <Check size={14} />
                  </span>
                )}
              </div>
              {imeiError && (
                <div className="text-[10px] font-semibold text-rose-600 flex items-center gap-1 pl-1">
                  <AlertCircle size={10} /> {imeiError}
                </div>
              )}
            </div>

            <button
              id="advance_step2_skip_btn"
              onClick={() => {
                if (imei.length < 15) {
                  simulateRandomImei();
                } else {
                  advanceToStep(2);
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              Confirm & Continue <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold btn">
            <span>Sticker or Entry Validated</span>
            <span className="text-indigo-600 flex items-center gap-0.5 hover:underline text-[11px]">Edit <Edit2 size={8} /></span>
          </div>
        )}
      </div>

      {/* STEP 2: THE VISUAL RECORD (SNAP) */}
      <div 
        id="step_card_2"
        onClick={() => maxStepReached >= 2 && currentStep !== 2 && setCurrentStep(2)}
        className={`bg-white rounded-3xl border transition-all duration-300 p-5 ${
          currentStep === 2 
            ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/20" 
            : "border-slate-100 opacity-60"
        } ${maxStepReached < 2 ? "pointer-events-none opacity-40" : "cursor-pointer hover:opacity-85"}`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              photos.front && photos.back ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
            }`}>
              {photos.front && photos.back ? <Check size={12} /> : "2"}
            </span>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 font-header">
              Capture Device Condition
            </h2>
          </div>
          {maxStepReached < 2 && <Lock size={12} className="text-slate-400" />}
        </div>

        {currentStep === 2 ? (
          <div className="flex flex-col gap-4 pt-1">
            <p className="text-xs text-slate-500 leading-relaxed">
              Take clear photos of the front, back, and any notable wear.
            </p>

            {/* Quick Demo Pre-load triggers for speed */}
            <div className="bg-indigo-50/40 border border-indigo-100/50 p-3 rounded-2xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                <Sparkles size={11} /> Quick simulation shortcut:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PREVIEW_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    id={`preset_simulate_btn_${idx}`}
                    onClick={() => applyPresetSimulate(p)}
                    className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-1 px-1.5 text-slate-700 text-[10px] font-bold truncate cursor-pointer text-left transition-all"
                  >
                    🚀 {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel structure of 3 ghost frames */}
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* FRONT VIEW */}
              <button
                id="snap_front_trigger"
                onClick={() => startCamera("front")}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                  photos.front ? "border-emerald-500 bg-slate-900" : "border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-400"
                }`}
              >
                {photos.front ? (
                  <>
                    <img src={photos.front} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                      <Check size={8} />
                    </span>
                  </>
                ) : (
                  <>
                    <Camera size={16} className="text-indigo-600 mb-1" />
                    <span className="text-[9px] font-bold">Front View</span>
                  </>
                )}
              </button>

              {/* BACK VIEW */}
              <button
                id="snap_back_trigger"
                onClick={() => startCamera("back")}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                  photos.back ? "border-emerald-500 bg-slate-900" : "border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-400"
                }`}
              >
                {photos.back ? (
                  <>
                    <img src={photos.back} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                      <Check size={8} />
                    </span>
                  </>
                ) : (
                  <>
                    <Camera size={16} className="text-indigo-600 mb-1" />
                    <span className="text-[9px] font-bold">Back View</span>
                  </>
                )}
              </button>

              {/* SIDE / DAMAGE VIEW */}
              <button
                id="snap_side_trigger"
                onClick={() => startCamera("side")}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer relative overflow-hidden ${
                  photos.side ? "border-emerald-500 bg-slate-900" : "border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-400"
                }`}
              >
                {photos.side ? (
                  <>
                    <img src={photos.side} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                      <Check size={8} />
                    </span>
                  </>
                ) : (
                  <>
                    <Camera size={16} className="text-slate-400 mb-1" />
                    <span className="text-[9px] font-bold">Side/Wear</span>
                  </>
                )}
              </button>
            </div>

            {/* Active slot Live Stream camera block inside step */}
            <AnimatePresence>
              {cameraActive && activeSlot && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-900 rounded-2xl overflow-hidden p-3 border border-slate-800 flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-center text-xs text-white">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400">
                      Live Snapshot Overlay: {activeSlot} View
                    </span>
                    <button onClick={stopCamera} className="text-slate-400 hover:text-white">Cancel</button>
                  </div>
                  
                  <div className="h-44 bg-black rounded-xl overflow-hidden relative">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Centered crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 border-2 border-indigo-400/60 rounded-full" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id="snap_capture_shutter"
                      onClick={capturePhoto}
                      className="flex-1 bg-white hover:bg-indigo-50 text-indigo-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Camera size={14} /> Capture Snap
                    </button>
                    <button
                      id="snap_simulate_fallback"
                      onClick={() => {
                        const randomImg = PREVIEW_PRESETS[Math.floor(Math.random() * PREVIEW_PRESETS.length)];
                        const newPhotos = { ...photos, [activeSlot]: randomImg.image };
                        setPhotos(newPhotos);
                        stopCamera();
                        runGeminiImageAppraisal(randomImg.image);
                        if (newPhotos.front && newPhotos.back) {
                          setTimeout(() => advanceToStep(3), 1000);
                        }
                      }}
                      className="bg-indigo-900 hover:bg-indigo-800 text-indigo-100 font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Simulate Snap
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {photos.front && photos.back ? (
              <button
                id="advance_step3_btn"
                onClick={() => advanceToStep(3)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                Confirm View Snaps <ChevronRight size={14} />
              </button>
            ) : null}

          </div>
        ) : (
          <div className="text-xs text-slate-400 flex justify-between font-semibold">
            {photos.front && photos.back ? (
              <span>Front & Back condition imagery saved</span>
            ) : (
              <span>Pending photo records</span>
            )}
            {maxStepReached >= 2 && (
              <span className="text-indigo-600 flex items-center gap-0.5 hover:underline text-[11px]">Edit <Edit2 size={8} /></span>
            )}
          </div>
        )}
      </div>

      {/* STEP 3: DEVICE SPECS (AUTO-FILLED VERIFICATION) */}
      <div 
        id="step_card_3"
        onClick={() => maxStepReached >= 3 && currentStep !== 3 && setCurrentStep(3)}
        className={`bg-white rounded-3xl border transition-all duration-300 p-5 ${
          currentStep === 3 
            ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/20" 
            : "border-slate-100 opacity-60"
        } ${maxStepReached < 3 ? "pointer-events-none opacity-40" : "cursor-pointer hover:opacity-85"}`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              maxStepReached > 3 ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
            }`}>
              {maxStepReached > 3 ? <Check size={12} /> : "3"}
            </span>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 font-header">
              Verify Specifications
            </h2>
          </div>
          {maxStepReached < 3 && <Lock size={12} className="text-slate-400" />}
        </div>

        {currentStep === 3 ? (
          <div className="flex flex-col gap-3.5 pt-1">
            <p className="text-xs text-slate-500 leading-relaxed">
              Confirm the internal hardware configuration of the device.
            </p>

            {isAnalyzing && (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-805">
                <RefreshCw size={14} className="animate-spin text-indigo-600" />
                <span>Reading captured image features via Gemini AI...</span>
              </div>
            )}

            {/* Form stack rows */}
            <div className="flex flex-col gap-3">
              
              {/* Row A: Brand & Model */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Brand & Model
                </label>
                <input
                  id="specs_brand_model"
                  type="text"
                  value={`${specs.brand} ${specs.model}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(" ");
                    const brand = parts[0] || "Apple";
                    const model = parts.slice(1).join(" ") || "iPhone";
                    setSpecs({ ...specs, brand, model });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white"
                  placeholder="e.g. Apple iPhone 15"
                />
              </div>

              {/* Row B: Storage Capacity */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Storage Capacity
                </label>
                <select
                  id="specs_storage"
                  value={specs.storage}
                  onChange={(e) => setSpecs({ ...specs, storage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-2.5 py-2 text-xs focus:outline-medium focus:bg-white text-slate-800"
                >
                  <option value="64GB">64 GB</option>
                  <option value="128GB">128 GB</option>
                  <option value="256GB">256 GB</option>
                  <option value="512GB">512 GB</option>
                  <option value="1TB">1 TB</option>
                </select>
              </div>

              {/* Row C: Colorway */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Colorway
                </label>
                <select
                  id="specs_color"
                  value={specs.color}
                  onChange={(e) => {
                    setSpecs({ ...specs, color: e.target.value });
                    // On complete, automatically reveal next step
                    setIsAnalyzing(false);
                    setTimeout(() => {
                      advanceToStep(4);
                    }, 500);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:bg-white text-slate-800"
                >
                  <option value="Natural Titanium">Natural Titanium</option>
                  <option value="Titanium Gray">Titanium Gray</option>
                  <option value="Bay Blue">Bay Blue</option>
                  <option value="Black Space">Black Space</option>
                  <option value="Silver Mint">Silver Mint</option>
                </select>
              </div>

              {/* Hardware specifications paragraph */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Technical Specifications Overview
                </label>
                <textarea
                  id="specs_notes"
                  value={specs.specifications}
                  onChange={(e) => setSpecs({ ...specs, specifications: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 resize-none focus:outline-none"
                />
              </div>

            </div>

            <button
              id="advance_step4_btn"
              onClick={() => advanceToStep(4)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              Verify & Lock Specs <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex justify-between font-semibold">
            {maxStepReached > 3 ? (
              <span>Locked: {specs.brand} {specs.model} ({specs.storage})</span>
            ) : (
              <span>Awaiting device configuration settings</span>
            )}
            {maxStepReached >= 3 && (
              <span className="text-indigo-600 flex items-center gap-0.5 hover:underline text-[11px]">Edit <Edit2 size={8} /></span>
            )}
          </div>
        )}
      </div>

      {/* STEP 4: VALUATION & STATE (RECORD) */}
      <div 
        id="step_card_4"
        onClick={() => maxStepReached >= 4 && currentStep !== 4 && setCurrentStep(4)}
        className={`bg-white rounded-3xl border transition-all duration-300 p-5 ${
          currentStep === 4 
            ? "border-indigo-600 shadow-md ring-1 ring-indigo-600/20" 
            : "border-slate-100 opacity-60"
        } ${maxStepReached < 4 ? "pointer-events-none opacity-40" : "cursor-pointer hover:opacity-85"}`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xs font-bold">
              4
            </span>
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 font-header">
              Grading & Pricing
            </h2>
          </div>
          {maxStepReached < 4 && <Lock size={12} className="text-slate-400" />}
        </div>

        {currentStep === 4 && (
          <div className="flex flex-col gap-4.5 pt-1">
            <p className="text-xs text-slate-500 leading-relaxed">
              Set the internal grading tier and your target listing price.
            </p>

            {/* Condition wear segment selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Physical Grade Segment
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {(["Mint", "Good", "Fair", "For Parts"] as const).map((g) => (
                  <button
                    key={g}
                    id={`grade_opt_${g.toLowerCase().replace(" ", "")}`}
                    onClick={() => setEvaluation({ ...evaluation, condition: g })}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                      evaluation.condition === g 
                        ? "bg-white text-indigo-700 shadow-sm" 
                        : "text-slate-400 hover:text-slate-750"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Appraisal estimate indicator */}
            <div className="bg-amber-50/50 border border-amber-150 p-3.5 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight block">Gemini Estimated Appraisal Value</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Estimated from marketplace listings</span>
              </div>
              <span className="text-lg font-black text-slate-800">${evaluation.estimatedValue}</span>
            </div>

            {/* Massive numeric entry field representing price input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pl-1">
                Listing Price
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4.5 font-sans font-black text-slate-400 text-1.5xl">$</span>
                <input
                  id="target_resell_price_input"
                  type="number"
                  value={evaluation.sellerPrice}
                  onChange={(e) => setEvaluation({ ...evaluation, sellerPrice: Number(e.target.value) })}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 rounded-2xl pl-10 pr-4 py-4 text-2xl font-black text-slate-900 focus:outline-none focus:bg-white tracking-widest font-header"
                />
              </div>
            </div>

            {netError && (
              <div className="bg-rose-50 text-rose-800 text-xs p-2.5 rounded-xl border border-rose-100">
                {netError}
              </div>
            )}

            {/* Final commit ledger button */}
            <button
              id="commit_ledger_record_btn"
              onClick={handleCommitToLedger}
              className="w-full bg-slate-900 hover:bg-black text-white font-extrabold py-4 px-4 rounded-2xl shadow-lg transition-transform text-xs tracking-wide uppercase select-none flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Check size={14} className="text-emerald-400" /> Commit to Inventory Ledger
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
