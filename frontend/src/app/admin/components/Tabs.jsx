import React from "react";

const styles = {
  container: {
    display: "flex",
    borderBottom: "2px solid #e0e0e0",
    marginBottom: "20px",
    gap: "0",
    flexWrap: "wrap",
    overflowX: "auto"
  },
  button: (isActive) => ({
    padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
    backgroundColor: isActive ? "#007bff" : "#f0f0f0",
    color: isActive ? "white" : "#333",
    border: "none",
    cursor: "pointer",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: "500",
    transition: "all 0.2s",
    borderRadius: isActive ? "4px 4px 0 0" : "0",
    marginRight: "5px",
    boxShadow: isActive ? "0 -2px 8px rgba(0, 123, 255, 0.2)" : "none",
    whiteSpace: "nowrap"
  })
};

export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div style={styles.container}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          style={styles.button(activeTab === tab.id)}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
