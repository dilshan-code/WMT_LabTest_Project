import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    // Core Mandatory Enhancement Field
    manufactureDate: {
      type: Date,
      required: [true, "Manufacture Date is required"],
    },
    // Versioned/Optional Fields 1-22
    expiryDate: {
      type: Date,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    brandName: {
      type: String,
      trim: true,
      default: "",
    },
    supplierName: {
      type: String,
      trim: true,
      default: "",
    },
    manufacturerCountry: {
      type: String,
      trim: true,
      default: "",
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    weightSize: {
      type: String,
      trim: true,
      default: "",
    },
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Pre-order"],
      default: "In Stock",
    },
    manufacturerName: {
      type: String,
      trim: true,
      default: "",
    },
    customerReviewCount: {
      type: Number,
      default: 0,
    },
    warrantyPeriod: {
      type: String,
      trim: true,
      default: "",
    },
    temperatureRequirement: {
      type: String,
      trim: true,
      default: "",
    },
    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },
    modelNumber: {
      type: String,
      trim: true,
      default: "",
    },
    barcodeNumber: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    freeShippingEligibility: {
      type: Boolean,
      default: false,
    },
    materialType: {
      type: String,
      trim: true,
      default: "",
    },
    couponCode: {
      type: String,
      trim: true,
      default: "",
    },
    warrantyTerms: {
      type: String,
      trim: true,
      default: "",
    },
    countryOfOrigin: {
      type: String,
      trim: true,
      default: "",
    },
    storageLocation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);