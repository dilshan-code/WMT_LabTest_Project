export const VERSIONS = {
  1: { key: "expiryDate", label: "Expiry Date", type: "date", section: "Physical & Logistics" },
  2: { key: "stockQuantity", label: "Stock Quantity", type: "number", section: "Specs & Inventory", default: 0 },
  3: { key: "brandName", label: "Brand Name", type: "text", section: "Specs & Inventory" },
  4: { key: "supplierName", label: "Supplier Name", type: "text", section: "Commercial & Warranty" },
  5: { key: "manufacturerCountry", label: "Manufacturer Country", type: "text", section: "Commercial & Warranty" },
  6: { key: "discountPercentage", label: "Discount Percentage", type: "number", section: "Commercial & Warranty", default: 0 },
  7: { key: "weightSize", label: "Weight / Size", type: "text", section: "Physical & Logistics" },
  8: { key: "availabilityStatus", label: "Availability Status", type: "select", section: "Specs & Inventory", options: ["In Stock", "Out of Stock", "Pre-order"], default: "In Stock" },
  9: { key: "manufacturerName", label: "Manufacturer Name", type: "text", section: "Specs & Inventory" },
  10: { key: "customerReviewCount", label: "Customer Review Count", type: "number", section: "Specs & Inventory", default: 0 },
  11: { key: "warrantyPeriod", label: "Warranty Period", type: "text", section: "Commercial & Warranty" },
  12: { key: "temperatureRequirement", label: "Temperature Requirement", type: "text", section: "Physical & Logistics" },
  13: { key: "serialNumber", label: "Serial Number", type: "text", section: "Specs & Inventory" },
  14: { key: "modelNumber", label: "Model Number", type: "text", section: "Specs & Inventory" },
  15: { key: "barcodeNumber", label: "Barcode Number", type: "text", section: "Specs & Inventory" },
  16: { key: "color", label: "Color", type: "text", section: "Physical & Logistics" },
  17: { key: "freeShippingEligibility", label: "Free Shipping Eligibility", type: "checkbox", section: "Commercial & Warranty", default: false },
  18: { key: "materialType", label: "Material Type", type: "text", section: "Physical & Logistics" },
  19: { key: "couponCode", label: "Coupon Code", type: "text", section: "Commercial & Warranty" },
  20: { key: "warrantyTerms", label: "Warranty Terms", type: "textarea", section: "Commercial & Warranty" },
  21: { key: "countryOfOrigin", label: "Country of Origin", type: "text", section: "Commercial & Warranty" },
  22: { key: "storageLocation", label: "Storage Location", type: "text", section: "Physical & Logistics" }
};

export const getActiveVersion = () => {
  // Read strict version from environment variable
  const envVersion = import.meta.env.VITE_LAB_TEST_VERSION;
  if (envVersion && envVersion !== "all") {
    const num = parseInt(envVersion, 10);
    if (!isNaN(num) && num >= 1 && num <= 22) {
      return { mode: "strict", version: num, ...VERSIONS[num] };
    }
  }
  
  // Read dynamic version from localStorage (if set by selector)
  const localVersion = localStorage.getItem("lab_test_active_version");
  if (localVersion && localVersion !== "all") {
    const num = parseInt(localVersion, 10);
    if (!isNaN(num) && num >= 1 && num <= 22) {
      return { mode: "dynamic", version: num, ...VERSIONS[num] };
    }
  }

  return { mode: "all", version: null };
};
