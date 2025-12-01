"use client";
import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Container } from "react-bootstrap";
import axios from "axios";
import "./analys.css";
import DropDownreg from "./components/dropdownreg";
import DropDownser from "./components/dropdownser";

// Метки для всех периодов
const weekLabels = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"];
const monthLabels = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yearLabels = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
const forecastLabels = ["2028", "2029", "2030", "2031", "2032", "2033", "2034"];

export default function AnalysisReg() {
  const [selectedRegion, setSelectedRegion] = useState("none");
  const [selectedService, setSelectedService] = useState("none");
  const [chartData, setChartData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [xLabels, setXLabels] = useState(weekLabels);
  const [activeButton, setActiveButton] = useState("week");

  const fetchData = async () => {
    if (selectedRegion !== "none" && selectedService !== "none") {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/analysis/${selectedRegion}/${selectedService}`
        );
        const dbData = res.data;

        // Берём данные по каждому периоду
        const weekData = dbData.find(d => d.period === "week")?.values || [];
        const monthData = dbData.find(d => d.period === "month")?.values || [];
        const yearData = dbData.find(d => d.period === "year")?.values || [];
        const futureData = dbData.find(d => d.period === "future")?.values || [];

        // Синхронизация: обрезаем/дополняем массивы до нужной длины
        const normalize = (arr, length) => {
          const nums = arr.map(Number);
          if (nums.length < length) {
            return [...nums, ...Array(length - nums.length).fill(0)];
          }
          return nums.slice(0, length);
        };

        const weekFinal = normalize(weekData, weekLabels.length);
        const monthFinal = normalize(monthData, monthLabels.length);
        const yearFinal = normalize(yearData, yearLabels.length);
        const futureFinal = normalize(futureData, forecastLabels.length);

        setChartData(
          activeButton === "week" ? weekFinal :
          activeButton === "month" ? monthFinal :
          yearFinal
        );
        setForecastData(futureFinal);
        setXLabels(
          activeButton === "week" ? weekLabels :
          activeButton === "month" ? monthLabels :
          yearLabels
        );
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    } else {
      setChartData([]);
      setForecastData([]);
      setXLabels([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRegion, selectedService, activeButton]);

  // Автообновление при изменении данных в админке
  useEffect(() => {
    const handler = () => {
      if (selectedRegion !== "none" && selectedService !== "none") {
        fetchData();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [selectedRegion, selectedService]);

  return (
    <Container fluid className="analysis-reg-container">
      <div className="analysis-reg">
        <h1>Analysis Registration</h1>

        <div className="drop-down">
          <DropDownreg selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
          <DropDownser selectedService={selectedService} setSelectedService={setSelectedService} />
        </div>

        <div className="chart-container">
          <div className="chart-controls-inside">
            <button className={activeButton === "week" ? "active" : ""} onClick={() => setActiveButton("week")}>Săptămâna</button>
            <button className={activeButton === "month" ? "active" : ""} onClick={() => setActiveButton("month")}>Luna</button>
            <button className={activeButton === "year" ? "active" : ""} onClick={() => setActiveButton("year")}>An</button>
          </div>

          <LineChart
            className="chart"
            height={400}
            yAxis={[{
              width: 80,
              scaleType: "linear",
              position: "right",
              style: { fill: "#000000" },
              labelStyle: { fill: "#000000", fontSize: 14 }
            }]}
            xAxis={[{
              data: xLabels,
              scaleType: "band",
              labelStyle: { fill: "#000000", fontSize: 14 }
            }]}
            series={[{
              data: chartData,
              showMark: true,
              color: "#26E2B3",
              lineWidth: 3,
            }]}
            margin={{ top: 20, right: 24, bottom: 24, left: 24 }}
          />
        </div>

        <LineChart
          className="chart forecast-chart"
          height={400}
          yAxis={[{
            width: 80,
            scaleType: "linear",
            position: "right",
            style: { fill: "#000000" },
            labelStyle: { fill: "#000000", fontSize: 14 }
          }]}
          xAxis={[{
            data: forecastLabels,
            scaleType: "band",
            labelStyle: { fill: "#000000", fontSize: 14 }
          }]}
          series={[{
            data: forecastData,
            showMark: true,
            color: "#FF5733",
            lineWidth: 3,
          }]}
          margin={{ top: 20, right: 0, bottom: 24, left: 24 }}
        />
      </div>
    </Container>
  );
}