"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DropDownreg({ selectedRegion, setSelectedRegion }) {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analysis/regions")
      .then(res => setRegions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
      <option value="none">Выберите регион</option>
      {regions.map((r, idx) => (
        <option key={idx} value={r}>{r}</option>
      ))}
    </select>
  );
}