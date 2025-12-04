import React from "react";

export default function Tabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="tabs-container">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
