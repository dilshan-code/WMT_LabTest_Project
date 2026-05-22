import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dns from "node:dns";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

// Force Node.js to use Google Public DNS (bypasses local network DNS blocks
// that refuse SRV record lookups required by mongodb+srv:// connections)
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

const connectDbWithFallback = async () => {
  if (process.env.MONGO_URI) {
    try {
      console.log("Attempting to connect to remote MongoDB Atlas...");
      console.log("URI (masked):", process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"));
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
      console.log("✅ MongoDB Atlas connected successfully!");
      return "online-atlas";
    } catch (atlasError) {
      console.error("❌ MongoDB Atlas connection FAILED!");
      console.error("   Error name:", atlasError.name);
      console.error("   Error message:", atlasError.message);
      if (atlasError.code) console.error("   Error code:", atlasError.code);
    }
  }

  const localUri = "mongodb://127.0.0.1:27017/item_manager";
  try {
    console.log(`\nAttempting to connect to local MongoDB (${localUri})...`);
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log("✅ Local MongoDB connected successfully!");
    return "online-local";
  } catch (localError) {
    console.warn("⚠️ Local MongoDB connection failed:", localError.message);
  }

  throw new Error("Both remote Atlas and local MongoDB connection attempts failed.");
};

connectDbWithFallback()
  .then((mode) => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ONLINE (${mode}) mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.warn("\n==================================================================");
    console.warn("⚠️  DATABASE CONNECTION WARNING: Remote Atlas and local database unreachable.");
    console.warn("⚠️  FALLING BACK: Booting server in OFFLINE MOCK MODE (items.json).");
    console.warn("⚠️  Your React app will work perfectly, letting you take screenshots!");
    console.warn("==================================================================\n");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in OFFLINE mode on port ${PORT}`);
    });
  });