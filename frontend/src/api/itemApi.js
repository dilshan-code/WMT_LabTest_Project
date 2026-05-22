import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// High-quality seed items for offline demonstration
const LOCAL_SEED_ITEMS = [
  {
    _id: "local_item_1",
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
    _id: "local_item_2",
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

// Helper to retrieve localStorage items
const getLocalItems = () => {
  const data = localStorage.getItem("item_manager_items");
  if (!data) {
    localStorage.setItem("item_manager_items", JSON.stringify(LOCAL_SEED_ITEMS));
    return LOCAL_SEED_ITEMS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return LOCAL_SEED_ITEMS;
  }
};

// Helper to set localStorage items
const setLocalItems = (items) => {
  localStorage.setItem("item_manager_items", JSON.stringify(items));
};

// GET all items
export const getItems = async () => {
  try {
    return await API.get("/items");
  } catch (error) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("⚠️ BACKEND UNREACHABLE: Falling back to localStorage data.");
      const items = getLocalItems();
      // Sort descending by createdAt
      const sorted = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { data: sorted };
    }
    throw error;
  }
};

// GET item by ID
export const getItemById = async (id) => {
  try {
    return await API.get(`/items/${id}`);
  } catch (error) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      const items = getLocalItems();
      const item = items.find((i) => i._id === id);
      if (!item) {
        return Promise.reject(new Error("Item not found in localStorage"));
      }
      return { data: item };
    }
    throw error;
  }
};

// CREATE item
export const createItem = async (itemData) => {
  try {
    return await API.post("/items", itemData);
  } catch (error) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("⚠️ BACKEND UNREACHABLE: Adding item to localStorage database.");
      const items = getLocalItems();
      const newItem = {
        _id: "local_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      setLocalItems(items);
      return { data: newItem };
    }
    throw error;
  }
};

// UPDATE item
export const updateItem = async (id, itemData) => {
  try {
    return await API.put(`/items/${id}`, itemData);
  } catch (error) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("⚠️ BACKEND UNREACHABLE: Modifying item in localStorage database.");
      const items = getLocalItems();
      const index = items.findIndex((i) => i._id === id);
      if (index === -1) {
        return Promise.reject(new Error("Item not found in localStorage"));
      }
      const updatedItem = {
        ...items[index],
        ...itemData,
        updatedAt: new Date().toISOString()
      };
      items[index] = updatedItem;
      setLocalItems(items);
      return { data: updatedItem };
    }
    throw error;
  }
};

// DELETE item
export const deleteItem = async (id) => {
  try {
    return await API.delete(`/items/${id}`);
  } catch (error) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.warn("⚠️ BACKEND UNREACHABLE: Deleting item from localStorage database.");
      const items = getLocalItems();
      const filtered = items.filter((i) => i._id !== id);
      setLocalItems(filtered);
      return { data: { message: "Item deleted successfully" } };
    }
    throw error;
  }
};

export default API;