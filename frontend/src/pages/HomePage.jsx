import { useEffect, useState } from "react";
import { deleteItem, getItems } from "../api/itemApi.js";
import ItemCard from "../components/ItemCard.jsx";
import { Search, Filter, RefreshCw, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [categories, setCategories] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data } = await getItems();
      setItems(data);
      setFilteredItems(data);
      
      // Extract unique categories dynamically
      const uniqueCats = ["All", ...new Set(data.map((item) => item.category))];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  // Run filter logic whenever search text or filter dropdowns change
  useEffect(() => {
    let result = items;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.brandName && item.brandName.toLowerCase().includes(query)) ||
          item.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (selectedStatus !== "All") {
      result = result.filter((item) => item.availabilityStatus === selectedStatus);
    }

    setFilteredItems(result);
  }, [searchQuery, selectedCategory, selectedStatus, items]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="fade-in">
      <div className="hero">
        <h1>Item Details Dashboard</h1>
        <p>View, manage, filter, and search inventory items with integrated Manufacture Date & version details.</p>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="filter-toolbar glass-card" style={{ padding: "20px", marginBottom: "30px", flexDirection: "row", flexWrap: "wrap", gap: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flex: "1", minWidth: "260px", position: "relative", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search by name, brand, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "10px 16px 10px 40px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", fontSize: "0.95rem" }}
          />
          <Search size={18} style={{ position: "absolute", left: "14px", color: "#64748b" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "white", outline: "none", fontSize: "0.9rem" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "white", outline: "none", fontSize: "0.9rem" }}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-order">Pre-order</option>
            </select>
          </div>

          <button 
            onClick={fetchItems} 
            className="btn secondary" 
            style={{ padding: "8px 12px", height: "38px" }}
            title="Refresh database"
          >
            <RefreshCw size={16} />
          </button>

          <Link to="/add-item" className="btn primary-gradient" style={{ padding: "8px 16px", height: "38px", fontSize: "0.9rem" }}>
            <Plus size={16} /> Add Item
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "#475569" }}>Loading inventory items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: "600", color: "#475569", marginBottom: "16px" }}>
            No items match your active filters or search query.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("All"); }}
            className="btn secondary"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;