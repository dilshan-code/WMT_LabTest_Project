import { useState, useEffect } from "react";
import { 
  Package, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  Info, 
  Truck, 
  Coins, 
  Scale, 
  Thermometer, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle 
} from "lucide-react";
import { getActiveVersion } from "../utils/versionConfig.js";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

function ItemForm({ initialValues, onSubmit, submitText }) {
  const activeVer = getActiveVersion();
  const isSingleVersion = activeVer.mode !== "all";

  const [activeTab, setActiveTab] = useState("core");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    manufactureDate: "",
    expiryDate: "",
    stockQuantity: 0,
    brandName: "",
    supplierName: "",
    manufacturerCountry: "",
    discountPercentage: 0,
    weightSize: "",
    availabilityStatus: "In Stock",
    manufacturerName: "",
    customerReviewCount: 0,
    warrantyPeriod: "",
    temperatureRequirement: "",
    serialNumber: "",
    modelNumber: "",
    barcodeNumber: "",
    color: "",
    freeShippingEligibility: false,
    materialType: "",
    couponCode: "",
    warrantyTerms: "",
    countryOfOrigin: "",
    storageLocation: "",
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        price: initialValues.price ?? "",
        manufactureDate: formatDateForInput(initialValues.manufactureDate),
        expiryDate: formatDateForInput(initialValues.expiryDate),
        stockQuantity: initialValues.stockQuantity ?? 0,
        discountPercentage: initialValues.discountPercentage ?? 0,
        customerReviewCount: initialValues.customerReviewCount ?? 0,
        freeShippingEligibility: initialValues.freeShippingEligibility ?? false,
        brandName: initialValues.brandName || "",
        supplierName: initialValues.supplierName || "",
        manufacturerCountry: initialValues.manufacturerCountry || "",
        weightSize: initialValues.weightSize || "",
        availabilityStatus: initialValues.availabilityStatus || "In Stock",
        manufacturerName: initialValues.manufacturerName || "",
        warrantyPeriod: initialValues.warrantyPeriod || "",
        temperatureRequirement: initialValues.temperatureRequirement || "",
        serialNumber: initialValues.serialNumber || "",
        modelNumber: initialValues.modelNumber || "",
        barcodeNumber: initialValues.barcodeNumber || "",
        color: initialValues.color || "",
        materialType: initialValues.materialType || "",
        couponCode: initialValues.couponCode || "",
        warrantyTerms: initialValues.warrantyTerms || "",
        countryOfOrigin: initialValues.countryOfOrigin || "",
        storageLocation: initialValues.storageLocation || "",
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.manufactureDate) {
      if (!isSingleVersion) setActiveTab("core");
      alert("Please fill in all required fields.");
      return;
    }

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      discountPercentage: Number(formData.discountPercentage),
      customerReviewCount: Number(formData.customerReviewCount),
    };

    onSubmit(submissionData);
  };

  const renderSingleVersionInput = () => {
    if (!isSingleVersion || !activeVer) return null;
    
    const { key, label, type, options } = activeVer;
    
    if (type === "select") {
      return (
        <div className="form-group col-6">
          <label>{label}</label>
          <select name={key} value={formData[key]} onChange={handleChange}>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }
    
    if (type === "checkbox") {
      return (
        <div className="form-group checkbox-group col-12">
          <label className="switch">
            <input
              type="checkbox"
              name={key}
              checked={formData[key]}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
          <span className="checkbox-label">{label}</span>
        </div>
      );
    }
    
    if (type === "textarea") {
      return (
        <div className="form-group col-12">
          <label>{label}</label>
          <textarea
            name={key}
            rows="3"
            value={formData[key]}
            onChange={handleChange}
            placeholder={`Enter ${label}...`}
          />
        </div>
      );
    }
    
    return (
      <div className="form-group col-6">
        <label>{label}</label>
        <input
          type={type}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          placeholder={`Enter ${label}...`}
        />
      </div>
    );
  };

  const tabs = [
    { id: "core", label: "Core Details", icon: Info },
    { id: "specs", label: "Specs & Inventory", icon: Package },
    { id: "logistics", label: "Physical & Logistics", icon: Layers },
    { id: "commercial", label: "Pricing & Warranty", icon: ShieldCheck },
  ];

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{submitText}</h2>
        {isSingleVersion ? (
          <p>Complete the fields below according to your assigned Lab Test Version {activeVer.version}.</p>
        ) : (
          <p>Complete the fields below. Versioned items 1-22 are logically organized.</p>
        )}
      </div>

      {/* Show version tabs ONLY in 'all' mode */}
      {!isSingleVersion && (
        <div className="form-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <form className="premium-form" onSubmit={handleSubmit}>
        {/* STRICT / SINGLE VERSION MODE FLAT RENDER */}
        {isSingleVersion ? (
          <div className="tab-pane fade-in">
            <h3 className="section-title">Product Details</h3>
            
            <div className="form-row">
              <div className="form-group col-6">
                <label className="required-label">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Smart Watch"
                  required
                />
              </div>
              <div className="form-group col-6">
                <label className="required-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label className="required-label">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 199.99"
                  required
                />
              </div>
              <div className="form-group col-6">
                <label className="required-label">Manufacture Date</label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={formData.manufactureDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-12">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Render the specific assigned single field for this version */}
            <div className="form-row">
              {renderSingleVersionInput()}
            </div>

            <div className="form-group col-12">
              <label className="required-label">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                required
              />
            </div>

            <div className="form-footer-nav" style={{ justifyContent: "flex-end" }}>
              <button type="submit" className="btn success-gradient flex-btn submit-btn">
                <CheckCircle size={18} /> {submitText}
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-TAB MASTER SOLUTION MODE */
          <>
            {activeTab === "core" && (
              <div className="tab-pane fade-in">
                <h3 className="section-title">Core Item Details</h3>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label className="required-label">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Smart Watch Active"
                      required
                    />
                  </div>
                  <div className="form-group col-6">
                    <label className="required-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Electronics"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label className="required-label">Price (Rs.)</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 199.99"
                      required
                    />
                  </div>
                  <div className="form-group col-6">
                    <label className="required-label">Manufacture Date</label>
                    <input
                      type="date"
                      name="manufactureDate"
                      value={formData.manufactureDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="required-label">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the product features..."
                    required
                  />
                </div>

                <div className="form-footer-nav">
                  <div />
                  <button
                    type="button"
                    className="btn primary-gradient flex-btn"
                    onClick={() => setActiveTab("specs")}
                  >
                    Next Section <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="tab-pane fade-in">
                <h3 className="section-title">Specifications & Inventory Control</h3>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Availability Status</label>
                    <select
                      name="availabilityStatus"
                      value={formData.availabilityStatus}
                      onChange={handleChange}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Pre-order">Pre-order</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Brand Name</label>
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder="e.g. ApexGear"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Manufacturer Name</label>
                    <input
                      type="text"
                      name="manufacturerName"
                      value={formData.manufacturerName}
                      onChange={handleChange}
                      placeholder="e.g. TechCorp Industries"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-4">
                    <label>Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      placeholder="SN-XXXX"
                    />
                  </div>
                  <div className="form-group col-4">
                    <label>Model Number</label>
                    <input
                      type="text"
                      name="modelNumber"
                      value={formData.modelNumber}
                      onChange={handleChange}
                      placeholder="MOD-XXXX"
                    />
                  </div>
                  <div className="form-group col-4">
                    <label>Barcode Number</label>
                    <input
                      type="text"
                      name="barcodeNumber"
                      value={formData.barcodeNumber}
                      onChange={handleChange}
                      placeholder="7890-XXXX"
                    />
                  </div>
                </div>

                <div className="form-footer-nav">
                  <button
                    type="button"
                    className="btn secondary flex-btn"
                    onClick={() => setActiveTab("core")}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn primary-gradient flex-btn"
                    onClick={() => setActiveTab("logistics")}
                  >
                    Next Section <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "logistics" && (
              <div className="tab-pane fade-in">
                <h3 className="section-title">Physical Specs & Logistics</h3>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Storage Location</label>
                    <input
                      type="text"
                      name="storageLocation"
                      value={formData.storageLocation}
                      onChange={handleChange}
                      placeholder="e.g. Warehouse A"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Temperature Requirement</label>
                    <input
                      type="text"
                      name="temperatureRequirement"
                      value={formData.temperatureRequirement}
                      onChange={handleChange}
                      placeholder="e.g. Below 25°C"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Weight / Size</label>
                    <input
                      type="text"
                      name="weightSize"
                      value={formData.weightSize}
                      onChange={handleChange}
                      placeholder="e.g. 250g"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Space Gray"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Material Type</label>
                    <input
                      type="text"
                      name="materialType"
                      value={formData.materialType}
                      onChange={handleChange}
                      placeholder="e.g. Aluminium"
                    />
                  </div>
                </div>

                <div className="form-footer-nav">
                  <button
                    type="button"
                    className="btn secondary flex-btn"
                    onClick={() => setActiveTab("specs")}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn primary-gradient flex-btn"
                    onClick={() => setActiveTab("commercial")}
                  >
                    Next Section <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "commercial" && (
              <div className="tab-pane fade-in">
                <h3 className="section-title">Commercial Details & Warranty</h3>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Supplier Name</label>
                    <input
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleChange}
                      placeholder="e.g. Global Distr."
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Manufacturer Country</label>
                    <input
                      type="text"
                      name="manufacturerCountry"
                      value={formData.manufacturerCountry}
                      onChange={handleChange}
                      placeholder="e.g. South Korea"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Country of Origin</label>
                    <input
                      type="text"
                      name="countryOfOrigin"
                      value={formData.countryOfOrigin}
                      onChange={handleChange}
                      placeholder="e.g. Germany"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Discount Percentage (%)</label>
                    <input
                      type="number"
                      name="discountPercentage"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Coupon Code</label>
                    <input
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleChange}
                      placeholder="e.g. SAVE20"
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>Warranty Period</label>
                    <input
                      type="text"
                      name="warrantyPeriod"
                      value={formData.warrantyPeriod}
                      onChange={handleChange}
                      placeholder="e.g. 24 Months"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="freeShippingEligibility"
                      checked={formData.freeShippingEligibility}
                      onChange={handleChange}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="checkbox-label">Eligible for Free Shipping</span>
                </div>

                <div className="form-group">
                  <label>Warranty Terms</label>
                  <textarea
                    name="warrantyTerms"
                    rows="3"
                    value={formData.warrantyTerms}
                    onChange={handleChange}
                    placeholder="Details of warranty..."
                  />
                </div>

                <div className="form-footer-nav">
                  <button
                    type="button"
                    className="btn secondary flex-btn"
                    onClick={() => setActiveTab("logistics")}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="btn success-gradient flex-btn submit-btn">
                    <CheckCircle size={18} /> {submitText}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default ItemForm;