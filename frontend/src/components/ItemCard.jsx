import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Package,
  Cpu,
  Trash2,
  Edit3
} from "lucide-react";
import { getActiveVersion } from "../utils/versionConfig.js";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function ItemCard({ item, onDelete }) {
  const activeVer = getActiveVersion();
  const isSingleVersion = activeVer.mode !== "all";
  const [showSpecs, setShowSpecs] = useState(false);

  // Availability Badge Styles
  const getAvailabilityClass = (status) => {
    switch (status) {
      case "In Stock":
        return "badge-success";
      case "Out of Stock":
        return "badge-danger";
      case "Pre-order":
        return "badge-warning";
      default:
        return "badge-neutral";
    }
  };

  // Check if any extra specs are populated
  const hasSpecs = 
    item.expiryDate || 
    item.stockQuantity > 0 || 
    item.brandName || 
    item.supplierName || 
    item.manufacturerCountry || 
    item.discountPercentage > 0 || 
    item.weightSize || 
    item.manufacturerName || 
    item.warrantyPeriod || 
    item.serialNumber || 
    item.modelNumber || 
    item.barcodeNumber || 
    item.color || 
    item.materialType || 
    item.couponCode || 
    item.countryOfOrigin || 
    item.storageLocation;

  return (
    <div className="glass-card">
      {/* Visual Header / Image Container */}
      <div className="card-image-container">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
          alt={item.name}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop";
          }}
        />
        {/* Availability Badge */}
        {(!isSingleVersion || activeVer.key === "availabilityStatus") && (
          <span className={`status-badge ${getAvailabilityClass(item.availabilityStatus)}`}>
            {item.availabilityStatus}
          </span>
        )}

        {/* Free Shipping Badge */}
        {item.freeShippingEligibility && (!isSingleVersion || activeVer.key === "freeShippingEligibility") && (
          <span className="shipping-badge">Free Shipping</span>
        )}

        {/* Discount Badge */}
        {item.discountPercentage > 0 && (!isSingleVersion || activeVer.key === "discountPercentage") && (
          <div className="discount-tag">
            {item.discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Main Details */}
      <div className="card-body">
        <div className="card-meta">
          <span className="card-category">{item.category}</span>
          <span className="card-price">Rs. {item.price.toFixed(2)}</span>
        </div>
        
        <h3 className="card-title">{item.name}</h3>
        <p className="card-desc">{item.description}</p>

        {/* Manufacture Date (Mandatory Core Enhancement) */}
        <div className="spec-item core-spec">
          <Calendar size={15} className="spec-icon" />
          <span className="spec-label">Manufactured:</span>
          <span className="spec-val highlight-val">{formatDate(item.manufactureDate)}</span>
        </div>

        {/* Single Version Field (Only if active mode is strict/dynamic versioned) */}
        {isSingleVersion && activeVer.key && item[activeVer.key] !== undefined && item[activeVer.key] !== null && item[activeVer.key] !== "" && (
          <div className="spec-item version-spec animated-glow">
            <Sparkles size={15} className="spec-icon success-text" />
            <span className="spec-label">{activeVer.label}:</span>
            <span className="spec-val highlight-val">
              {activeVer.type === "date" 
                ? formatDate(item[activeVer.key]) 
                : activeVer.type === "checkbox"
                  ? (item[activeVer.key] ? "Yes" : "No")
                  : item[activeVer.key].toString()}
            </span>
          </div>
        )}

        {/* Dynamic Expanded Specs Panel (Versioned Fields 1-22) - ONLY visible in master mode */}
        {!isSingleVersion && hasSpecs && (
          <div className="specs-expander">
            <button 
              onClick={() => setShowSpecs(!showSpecs)} 
              className="specs-toggle-btn"
              type="button"
            >
              <span>{showSpecs ? "Hide Technical Details" : "Show Technical Details"}</span>
              {showSpecs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showSpecs && (
              <div className="specs-grid-panel fade-in">
                
                {/* Physical Group */}
                <div className="specs-group">
                  <h4 className="group-title"><Layers size={13} /> Logistical & Physical</h4>
                  {item.weightSize && (
                    <div className="mini-spec">
                      <span className="lbl">Weight/Size:</span> <span className="val">{item.weightSize}</span>
                    </div>
                  )}
                  {item.color && (
                    <div className="mini-spec">
                      <span className="lbl">Color:</span> <span className="val">{item.color}</span>
                    </div>
                  )}
                  {item.materialType && (
                    <div className="mini-spec">
                      <span className="lbl">Material:</span> <span className="val">{item.materialType}</span>
                    </div>
                  )}
                  {item.storageLocation && (
                    <div className="mini-spec">
                      <span className="lbl">Storage:</span> <span className="val">{item.storageLocation}</span>
                    </div>
                  )}
                  {item.temperatureRequirement && (
                    <div className="mini-spec">
                      <span className="lbl">Temp Req:</span> <span className="val">{item.temperatureRequirement}</span>
                    </div>
                  )}
                  {item.expiryDate && (
                    <div className="mini-spec">
                      <span className="lbl">Expires:</span> <span className="val warning-text">{formatDate(item.expiryDate)}</span>
                    </div>
                  )}
                </div>

                {/* Inventory & Hardware Group */}
                <div className="specs-group">
                  <h4 className="group-title"><Package size={13} /> Stock & Specs</h4>
                  <div className="mini-spec">
                    <span className="lbl">Stock Qty:</span> <span className="val">{item.stockQuantity} pcs</span>
                  </div>
                  {item.brandName && (
                    <div className="mini-spec">
                      <span className="lbl">Brand:</span> <span className="val">{item.brandName}</span>
                    </div>
                  )}
                  {item.manufacturerName && (
                    <div className="mini-spec">
                      <span className="lbl">Maker:</span> <span className="val">{item.manufacturerName}</span>
                    </div>
                  )}
                  {item.serialNumber && (
                    <div className="mini-spec">
                      <span className="lbl">Serial No:</span> <span className="val mono">{item.serialNumber}</span>
                    </div>
                  )}
                  {item.modelNumber && (
                    <div className="mini-spec">
                      <span className="lbl">Model No:</span> <span className="val mono">{item.modelNumber}</span>
                    </div>
                  )}
                  {item.barcodeNumber && (
                    <div className="mini-spec">
                      <span className="lbl">Barcode:</span> <span className="val mono">{item.barcodeNumber}</span>
                    </div>
                  )}
                </div>

                {/* Business & Support Group */}
                <div className="specs-group">
                  <h4 className="group-title"><ShieldCheck size={13} /> Support & Business</h4>
                  {item.supplierName && (
                    <div className="mini-spec">
                      <span className="lbl">Supplier:</span> <span className="val">{item.supplierName}</span>
                    </div>
                  )}
                  {item.manufacturerCountry && (
                    <div className="mini-spec">
                      <span className="lbl">Mfd In:</span> <span className="val">{item.manufacturerCountry}</span>
                    </div>
                  )}
                  {item.countryOfOrigin && (
                    <div className="mini-spec">
                      <span className="lbl">Origin:</span> <span className="val">{item.countryOfOrigin}</span>
                    </div>
                  )}
                  {item.warrantyPeriod && (
                    <div className="mini-spec">
                      <span className="lbl">Warranty:</span> <span className="val success-text">{item.warrantyPeriod}</span>
                    </div>
                  )}
                  {item.couponCode && (
                    <div className="mini-spec">
                      <span className="lbl">Coupon:</span> <span className="val coupon-badge">{item.couponCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card-actions-panel">
        <Link className="card-btn-edit" to={`/edit-item/${item._id}`}>
          <Edit3 size={15} /> Edit
        </Link>
        <button className="card-btn-delete" onClick={() => onDelete(item._id)}>
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
}

export default ItemCard;