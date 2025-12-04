"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./components/Tabs";
import AnalysisForm from "./components/AnalysisForm";
import AnalysisTable from "./components/AnalysisTable";
import PricesForm from "./components/PricesForm";
import PricesTable from "./components/PricesTable";

const globalStyles = {
  body: {
    backgroundColor: "transparent",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: "0",
    padding: "0"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "clamp(15px, 4vw, 30px)"
  },
  header: {
    marginBottom: "clamp(20px, 5vw, 30px)"
  },
  title: {
    fontSize: "clamp(24px, 5vw, 32px)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "#666",
    margin: "0"
  },
  content: {
    animation: "fadeIn 0.3s ease-in"
  }
};

export default function AdminPanel() {
  const [region, setRegion] = useState("");
  const [service, setService] = useState("");
  const [period, setPeriod] = useState("week");
  const [analysisValues, setAnalysisValues] = useState(Array(7).fill(""));
  const [analysisData, setAnalysisData] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [priceYearMonth, setPriceYearMonth] = useState(() => {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  });
  const [pricesData, setPricesData] = useState({
    "Gaze naturale": "",
    "Energie electrica": "",
    "Energie termica": "",
    "Apa si canalizare": ""
  });
  const [allPrices, setAllPrices] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("analysis");

  const API_URL = "http://localhost:5000/api/analysis";
  const PRICES_API_URL = "http://localhost:5000/api/prices";

  const fetchAnalysisData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisData(res.data);
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке данных анализа");
    }
  };

  const fetchPricesData = async () => {
    try {
      const res = await axios.get(PRICES_API_URL);
      setAllPrices(res.data);
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке цен");
    }
  };

  useEffect(() => {
    fetchAnalysisData();
    fetchPricesData();
  }, []);

  const handleAnalysisSubmit = async () => {
    if (!region.trim() || !service.trim()) {
      alert("Заполните регион и сервис");
      return;
    }

    try {
      setAnalysisLoading(true);
      const token = localStorage.getItem("token");
      const finalValues = analysisValues.map(v => Number(v) || 0);

      await axios.post(API_URL, {
        region,
        service,
        period,
        values: finalValues,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRegion("");
      setService("");
      setPeriod("week");
      setAnalysisValues(Array(7).fill(""));
      await fetchAnalysisData();
      alert("Данные добавлены успешно");
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении данных");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handlePricesSubmit = async () => {
    try {
      setPricesLoading(true);
      const token = localStorage.getItem("token");
      const prices = [];

      for (const [service, price] of Object.entries(pricesData)) {
        if (price) {
          prices.push({ service, price: parseFloat(price) });
        }
      }

      if (prices.length === 0) {
        alert("Введите хотя бы одну цену");
        setPricesLoading(false);
        return;
      }

      await axios.post(PRICES_API_URL, {
        yearMonth: priceYearMonth,
        prices
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPricesData({
        "Gaze naturale": "",
        "Energie electrica": "",
        "Energie termica": "",
        "Apa si canalizare": ""
      });
      await fetchPricesData();
      alert("Цены добавлены успешно");
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении цен");
    } finally {
      setPricesLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (!confirm("Вы уверены?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAnalysisData();
      alert("✓ Данные удалены");
    } catch (err) {
      console.error(err);
      alert("✗ Ошибка при удалении");
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const lengths = { week: 7, month: 12, year: 7, future: 7 };
    setAnalysisValues(Array(lengths[newPeriod]).fill(""));
  };

  const tabs = [
    { id: "analysis", label: "Управление данными анализа" },
    { id: "prices", label: "Управление ценами" }
  ];

  return (
    <div style={globalStyles.body}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={globalStyles.container}>
        <div style={globalStyles.header}>
          <h1 style={globalStyles.title}>Админ-панель</h1>
          <p style={globalStyles.subtitle}>Управление данными анализа и ценами</p>
        </div>

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        <div style={globalStyles.content}>
          {activeTab === "analysis" && (
            <div>
              <AnalysisForm
                region={region}
                setRegion={setRegion}
                service={service}
                setService={setService}
                period={period}
                setPeriod={handlePeriodChange}
                values={analysisValues}
                setValues={setAnalysisValues}
                onSubmit={handleAnalysisSubmit}
                loading={analysisLoading}
              />
              <AnalysisTable
                data={analysisData}
                onDelete={handleDeleteAnalysis}
                loading={analysisLoading}
              />
            </div>
          )}

          {activeTab === "prices" && (
            <div>
              <PricesForm
                yearMonth={priceYearMonth}
                setYearMonth={setPriceYearMonth}
                pricesData={pricesData}
                setPricesData={setPricesData}
                onSubmit={handlePricesSubmit}
                loading={pricesLoading}
              />
              <PricesTable data={allPrices} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
