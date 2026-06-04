export interface PhoneRecord {
  id: string;
  brand: string;
  model: string;
  color: string;
  storage: string;
  ram?: string;
  condition: "New" | "UK Used" | "Refurbished" | "Open Box" | "Excellent" | "Good" | "Fair" | "Poor";
  image?: string;
  specifications: string;
  estimatedValue: number;
  sellerPrice: number; // Selling Price
  purchasePrice?: number; // Purchase Cost
  supplier?: string;
  quantity: number;
  warranty?: string;
  imei: string;
  imageUrl?: string;
  createdAt: string;
  status: "In Stock" | "Low Stock" | "Sold Out" | "Reserved";
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

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  phonesBought: string[]; // array of PhoneRecord IDs or just names
  warrantyStatus: string;
  receipts: string[];
  notes?: string;
}

export interface SaleRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  phoneId: string;
  imei: string;
  sellingPrice: number;
  paymentMethod: "Cash" | "Transfer" | "POS" | "Card";
  discount: number;
  warrantyStartDate: string;
  date: string;
}
