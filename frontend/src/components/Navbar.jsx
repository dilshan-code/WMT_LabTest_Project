import { NavLink } from "react-router-dom";
import { getActiveVersion, VERSIONS } from "../utils/versionConfig.js";

function Navbar() {
  const activeVer = getActiveVersion();
  
  // Only allow dynamic selection if not strictly locked in production .env
  const isEnvLocked = !!(import.meta.env.VITE_LAB_TEST_VERSION && import.meta.env.VITE_LAB_TEST_VERSION !== "all");

  const handleVersionChange = (e) => {
    const value = e.target.value;
    if (value === "all") {
      localStorage.removeItem("lab_test_active_version");
    } else {
      localStorage.setItem("lab_test_active_version", value);
    }
    window.location.reload();
  };

  const getSelectValue = () => {
    if (activeVer.mode === "strict") return activeVer.version.toString();
    if (activeVer.mode === "dynamic") return activeVer.version.toString();
    return "all";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand-group">
          <NavLink to="/" className="brand">Item Manager</NavLink>
          {isEnvLocked ? (
            <span className="version-indicator-badge env-locked">
              Version {activeVer.version}
            </span>
          ) : (
            <div className="version-selector-container">
              <label htmlFor="version-select">Active Sheet:</label>
              <select
                id="version-select"
                value={getSelectValue()}
                onChange={handleVersionChange}
                className="version-select-dropdown"
              >
                <option value="all">All Fields (Master Mode)</option>
                {Object.entries(VERSIONS).map(([num, info]) => (
                  <option key={num} value={num}>
                    Version {num}: {info.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/add-item">Add Item</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;