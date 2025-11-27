import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./services.css";

const services = [
  { value: "none", label: "Selectează serviciul" },
  { value: "Gaze naturale", label: "Gaze naturale" },
  { value: "Energie electrica", label: "Energie electrică" },
  { value: "Energie termica", label: "Energie termică" },
  { value: "Apa si canalizare", label: "Apă și canalizare" }
];

export default function Services({ selectedService, setSelectedService }) {
  return (
    <div className="dropdown-container">
     <Select id="service-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
        >
        {services.map((option, index) => (
          <MenuItem key={option.value} value={option.value} disabled={index === 0}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}