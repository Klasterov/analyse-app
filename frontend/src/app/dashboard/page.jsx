"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Services from "./components/services";
import LanguageSelector from "../../components/LanguageSelector";
import { LineChart } from "@mui/x-charts";
import { t, getLanguage } from "../../utils/i18n";
import axios from "axios";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();
  const [language, setLanguage] = useState('ro');
  const API_URL = "http://localhost:5000/api/meter-readings";

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

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
      alert(t('errorMessage', language));
      return;
    }

    if (selectedService === "none") {
      alert(t('selectService', language));
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

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/add`, {
        month: newMonth,
        previous_value: prevValue,
        current_value: Number(currentValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      try {
        const marker = Date.now().toString();
        localStorage.setItem('lastReadingsUpdated', marker);
      } catch (e) {
        console.warn('Could not write lastReadingsUpdated to localStorage', e);
      }
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'clamp(20px, 4vw, 30px)',
        flexWrap: 'wrap',
        gap: 'clamp(10px, 2vw, 20px)',
      }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          color: '#1e3c72',
          margin: 0,
        }}>
          {t('dashboard', language)}
        </h1>
        <LanguageSelector />
      </div>

      <Services selectedService={selectedService} setSelectedService={setSelectedService} />

      <div className="input-data" style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder={t('currentReading', language)}
        />
        <button onClick={handleAddValue} style={{ marginLeft: "10px" }}>
          {t('addReading', language)}
        </button>
      </div>

      {monthlyUsage.length > 0 && (
        <div style={{ marginTop: "40px", textAlign: "center", color: "white" }}>
          <h3>{t('myReadings', language)}:</h3>
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
        {t('logout', language)}
      </button>
    </div>
  );
}