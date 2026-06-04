import { PhoneRecord, SaleRecord, CustomerRecord } from "../src/types.ts";

export const inventory: PhoneRecord[] = [
  {
    id: "phone-1",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Natural Titanium",
    storage: "256GB",
    ram: "8GB",
    condition: "New",
    specifications: "Triple 48MP/12MP/12MP cameras, A17 Pro Chip, 120Hz OLED screen",
    estimatedValue: 950,
    sellerPrice: 1100,
    purchasePrice: 900,
    supplier: "TechDistro UK",
    quantity: 4,
    warranty: "1 Year Apple Care",
    imei: "358921102948123",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    status: "In Stock"
  },
  {
    id: "phone-2",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanium Gray",
    storage: "512GB",
    ram: "12GB",
    condition: "New",
    specifications: "Quad 200MP camera, Snapdragon 8 Gen 3 for Galaxy, S-Pen",
    estimatedValue: 1050,
    sellerPrice: 1200,
    purchasePrice: 950,
    supplier: "Samsung Direct",
    quantity: 2,
    warranty: "1 Year Official",
    imei: "351182281928341",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: "In Stock"
  },
  {
    id: "phone-3",
    brand: "Google",
    model: "Pixel 8 Pro",
    color: "Bay Blue",
    storage: "128GB",
    ram: "12GB",
    condition: "UK Used",
    specifications: "Google Tensor G3 chip, AI Camera features",
    estimatedValue: 620,
    sellerPrice: 700,
    purchasePrice: 550,
    supplier: "London Wholesalers",
    quantity: 1,
    warranty: "3 Months Store",
    imei: "354123512391024",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    status: "Low Stock"
  }
];

export const sales: SaleRecord[] = [];
export const customers: CustomerRecord[] = [];
