import Item from "../models/Item.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const OFFLINE_FILE = path.resolve("items.json");

// High-quality seed items for offline demonstration
const SEED_ITEMS = [
  {
    _id: "mock_item_1",
    name: "Apex Gaming Laptop",
    category: "Electronics",
    price: 1499.99,
    description: "Ultra-performance gaming laptop with RTX 4080, 32GB DDR5 RAM, and 1TB NVMe SSD.",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    manufactureDate: new Date("2026-01-15").toISOString(),
    expiryDate: null,
    stockQuantity: 12,
    brandName: "ApexTech",
    supplierName: "Apex Logistics Ltd",
    manufacturerCountry: "Taiwan",
    discountPercentage: 10,
    weightSize: "2.4 kg",
    availabilityStatus: "In Stock",
    manufacturerName: "Apex Micro-Systems",
    customerReviewCount: 88,
    warrantyPeriod: "2 Years",
    temperatureRequirement: "15°C - 35°C",
    serialNumber: "SN-APEX-4080-99",
    modelNumber: "APX-G15-2026",
    barcodeNumber: "8809123456789",
    color: "Stealth Black",
    freeShippingEligibility: true,
    materialType: "Aluminium Alloy",
    couponCode: "APEXPLAY",
    warrantyTerms: "Covers parts and labor for 2 years.",
    countryOfOrigin: "Taiwan",
    storageLocation: "Shelf A-12",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: "mock_item_2",
    name: "ErgoFit Smart Watch",
    category: "Wearables",
    price: 249.99,
    description: "Premium fitness smartwatch featuring continuous heart rate, sleep tracker, and GPS tracking.",
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
    manufactureDate: new Date("2026-03-20").toISOString(),
    expiryDate: null,
    stockQuantity: 45,
    brandName: "ErgoFit",
    supplierName: "Globex Distribution",
    manufacturerCountry: "South Korea",
    discountPercentage: 15,
    weightSize: "45g",
    availabilityStatus: "In Stock",
    manufacturerName: "Ergo Electronics",
    customerReviewCount: 142,
    warrantyPeriod: "1 Year",
    temperatureRequirement: "-10°C - 45°C",
    serialNumber: "SN-ERGO-FIT-02",
    modelNumber: "EF-W4",
    barcodeNumber: "8809987654321",
    color: "Space Gray",
    freeShippingEligibility: true,
    materialType: "Titanium & Silicon",
    couponCode: "FITLIFE",
    warrantyTerms: "1 year manufacturer replacement warranty.",
    countryOfOrigin: "South Korea",
    storageLocation: "Shelf C-05",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper to read offline items from items.json
const readOfflineItems = () => {
  try {
    if (!fs.existsSync(OFFLINE_FILE)) {
      writeOfflineItems(SEED_ITEMS);
      return SEED_ITEMS;
    }
    const data = fs.readFileSync(OFFLINE_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("❌ Error reading offline items:", error);
    return SEED_ITEMS;
  }
};

// Helper to write offline items to items.json
const writeOfflineItems = (items) => {
  try {
    fs.writeFileSync(OFFLINE_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (error) {
    console.error("❌ Error writing offline items:", error);
  }
};

// Get all items
export const getItems = async (req, res) => {
  // Check if Mongoose connection is disconnected
  if (mongoose.connection.readyState !== 1) {
    console.log("ℹ️ MONGODB OFFLINE: Fetching items from items.json");
    const items = readOfflineItems();
    // Sort items by createdAt descending (just like Mongoose)
    const sortedItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json(sortedItems);
  }

  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// Get item by ID
export const getItemById = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log(`ℹ️ MONGODB OFFLINE: Fetching item ${req.params.id} from items.json`);
    const items = readOfflineItems();
    const item = items.find(item => item._id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  }

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

// Create new item
export const createItem = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log("ℹ️ MONGODB OFFLINE: Creating item in items.json");
    try {
      const items = readOfflineItems();
      
      // Simple validation for required fields
      const { name, category, price, description, manufactureDate } = req.body;
      if (!name || !category || price === undefined || !description || !manufactureDate) {
        return res.status(400).json({ message: "Validation error: Missing core fields" });
      }

      const newItem = {
        _id: "offline_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      items.push(newItem);
      writeOfflineItems(items);
      return res.status(201).json(newItem);
    } catch (error) {
      return res.status(400).json({ message: "Failed to create item", error: error.message });
    }
  }

  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

// Update item by ID
export const updateItem = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log(`ℹ️ MONGODB OFFLINE: Updating item ${req.params.id} in items.json`);
    try {
      const items = readOfflineItems();
      const itemIndex = items.findIndex(item => item._id === req.params.id);

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
      }

      const updatedItem = {
        ...items[itemIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      items[itemIndex] = updatedItem;
      writeOfflineItems(items);
      return res.status(200).json(updatedItem);
    } catch (error) {
      return res.status(400).json({ message: "Failed to update item", error: error.message });
    }
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// Delete item by ID
export const deleteItem = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.log(`ℹ️ MONGODB OFFLINE: Deleting item ${req.params.id} from items.json`);
    try {
      const items = readOfflineItems();
      const itemIndex = items.findIndex(item => item._id === req.params.id);

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
      }

      items.splice(itemIndex, 1);
      writeOfflineItems(items);
      return res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete item" });
    }
  }

  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};