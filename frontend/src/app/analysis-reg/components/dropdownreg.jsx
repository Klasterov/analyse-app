import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./dropdown.css";

const regions = [
  { value: "none", label: "Selectează regiunea" },
  { value: "Nord", label: "Nord" },
  { value: "Centru", label: "Centru" },
  { value: "Sud", label: "Sud" }
];

export default function DropDownreg({ selectedRegion, setSelectedRegion }) {
  return (
    <div className="dropdown-container">
      <Select id="region-select" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
        {regions.map((option, index) => (
          <MenuItem key={option.value} value={option.value} disabled={index === 0}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}