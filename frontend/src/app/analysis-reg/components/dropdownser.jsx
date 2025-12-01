"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DropDownser({ selectedService, setSelectedService }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analysis/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
      <option value="none">Выберите сервис</option>
      {services.map((s, idx) => (
        <option key={idx} value={s}>{s}</option>
      ))}
    </select>
  );
}