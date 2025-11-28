"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Services from "./components/services";
import { LineChart } from "@mui/x-charts";
import axios from "axios";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();
  const API_URL = "http://localhost:5000/api/meter-readings";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedService");
    router.push("/LogIn");
  };

  const monthsList = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  const [selectedService, setSelectedService] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("selectedService") || "none" : "none";
  });

  const [serviceData, setServiceData] = useState({});
  const [currentValue, setCurrentValue] = useState("");

  // Загружаем данные из базы при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/LogIn");
          return;
        }

        const res = await axios.get(`${API_URL}/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Преобразуем данные из базы в формат serviceData
        const grouped = {};
        res.data.forEach(reading => {
          if (!grouped[selectedService]) {
            grouped[selectedService] = { values: [], months: [] };
          }
          grouped[selectedService].values.push(reading.current_value);
          grouped[selectedService].months.push(reading.month);
        });

        setServiceData(grouped);
      } catch (err) {
        console.error("Ошибка загрузки показаний:", err);
      }
    };

    fetchData();
  }, [selectedService]);

  const handleAddValue = async () => {
    if (currentValue === "" || isNaN(currentValue)) {
      alert("Introduceți o valoare validă!");
      return;
    }

    if (selectedService === "none") {
      alert("Selectați un serviciu!");
      return;
    }

    const updatedServiceData = { ...serviceData };
    if (!updatedServiceData[selectedService]) {
      updatedServiceData[selectedService] = { values: [], months: [] };
    }

    let lastMonthIndex = monthsList.indexOf(updatedServiceData[selectedService].months.slice(-1)[0]);
    let newMonth = monthsList[(lastMonthIndex + 1) % 12];

    const prevValue = updatedServiceData[selectedService].values.slice(-1)[0] || 0;

    updatedServiceData[selectedService].values.push(Number(currentValue));
    updatedServiceData[selectedService].months.push(newMonth);

    updatedServiceData[selectedService].values = updatedServiceData[selectedService].values.slice(-6);
    updatedServiceData[selectedService].months = updatedServiceData[selectedService].months.slice(-6);

    setServiceData(updatedServiceData);
    setCurrentValue("");

    // 👉 Отправляем на сервер
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/add`, {
        month: newMonth,
        previous_value: prevValue,
        current_value: Number(currentValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Ошибка при сохранении на сервер:", error);
    }
  };

  const calculateMonthlyUsage = () => {
    if (!serviceData[selectedService] || serviceData[selectedService].values.length < 2) {
      return [];
    }
    return serviceData[selectedService].values.map((value, i, arr) =>
      i === 0 ? 0 : value - arr[i - 1]
    ).slice(1);
  };

  const monthlyUsage = calculateMonthlyUsage();

  return (
    <div className="dashboard-container">
      <Services selectedService={selectedService} setSelectedService={setSelectedService} />

      <div className="input-data" style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder="Introduceți valoarea contorului"
        />
        <button onClick={handleAddValue} style={{ marginLeft: "10px" }}>
          Adaugă
        </button>
      </div>

      {monthlyUsage.length > 0 && (
        <div style={{ marginTop: "40px", textAlign: "center", color: "white" }}>
          <h3>Graficul consumului lunar pentru {selectedService}:</h3>
          <LineChart
            className="chart"
            xAxis={[{
              data: serviceData[selectedService]?.months || [],
              scaleType: "band",
              labelStyle: { fill: "white", fontSize: 14 },
              style: { fill: "white" },
            }]}
            series={[{
              data: monthlyUsage,
              color: "#26E2B3",
              strokeWidth: 1,
            }]}
            height={300}
          />
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }} className="logout-button">
        Delogare
      </button>
    </div>
  );
}