import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ONLINE mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.warn("\n==================================================================");
    console.warn("⚠️  DATABASE CONNECTION WARNING: Port 27017 or connection blocked.");
    console.warn("⚠️  FALLING BACK: Booting server in OFFLINE MOCK MODE (items.json).");
    console.warn("⚠️  Your React app will work perfectly, letting you take screenshots!");
    console.warn("==================================================================\n");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in OFFLINE mode on port ${PORT}`);
    });
  });