export interface PhoneRecord {
  id: string;
  brand: string;
  model: string;
  color: string;
  storage: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  specifications: string;
  estimatedValue: number;
  sellerPrice: number;
  imei: string;
  imageUrl?: string;
  createdAt: string;
  status: "In Stock" | "Sold" | "Reserved";
}

export interface AnalysisResult {
  brand: string;
  model: string;
  color: string;
  suggestedStorage: string;
  specifications: string;
  estimatedValue: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
}
