import { Router } from "express";
import { inventory } from "../data.ts";
import { PhoneRecord } from "../../src/types.ts";

const router = Router();

// GET phone inventory
router.get("/", (req, res) => {
  res.json(inventory);
});

// POST to phone inventory
router.post("/", (req, res) => {
  const { 
    brand, model, color, storage, ram, condition, 
    specifications, estimatedValue, sellerPrice, purchasePrice,
    supplier, quantity, warranty, imei, imageUrl, status 
  } = req.body;
  
  if (!brand || !model) {
    res.status(400).json({ error: "Brand and Model are required" });
    return;
  }

  const newRecord: PhoneRecord = {
    id: "phone-" + Math.random().toString(36).substring(2, 11),
    brand,
    model,
    color: color || "Unknown",
    storage: storage || "128GB",
    ram,
    condition: condition || "New",
    specifications: specifications || "",
    estimatedValue: Number(estimatedValue) || 0,
    sellerPrice: Number(sellerPrice) || 0,
    purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
    supplier,
    quantity: Number(quantity) || 1,
    warranty,
    imei: imei || "",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
    status: status || "In Stock"
  };

  inventory.unshift(newRecord);
  res.status(201).json(newRecord);
});

// PUT (update) a phone record
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const index = inventory.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  inventory[index] = {
    ...inventory[index],
    ...req.body,
    id: inventory[index].id,
    createdAt: inventory[index].createdAt
  };

  res.json(inventory[index]);
});

// DELETE a phone record
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = inventory.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  const deleted = inventory.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

export default router;
