"useState";
"use client";
import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Container } from "react-bootstrap";
import "./analys.css";
import DropDownreg from "./components/dropdownreg";
import DropDownser from "./components/dropdownser";

const dataSets = {
    "Nord": {
        "Gaze naturale": { week: [10, 12, 14, 16, 18, 11, 15], month: [14, 13, 12, 18, 17, 16, 19], year: [20, 22, 21, 19, 18, 17, 16] },
        "Energie electrica": { week: [20, 18.50, 15, 16, 19, 12, 20], month: [20, 18.50, 12, 18, 19, 15, 19], year: [20, 18.50, 15, 10, 19, 15, 15] }
    }
};

const forecastDataSets = {
    "Nord": {
        "Gaze naturale": { future: [22, 24, 26, 28, 30, 27, 25] },
        "Energie electrica": { future: [18, 19, 21, 23, 22, 20, 21] }
    }
};

const weekLabels = [`Lu`, `Ma`, `Mi`, `Jo`, `Vi`, `Sa`, `Du`];
const monthLabels = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul"];
const yearLabels = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
const forecastLabels = ["2028", "2029", "2030", "2031", "2032", "2033", "2034"];

export default function AnalysisReg() {
    const [selectedRegion, setSelectedRegion] = useState("none");
    const [selectedService, setSelectedService] = useState("none");
    const [chartData, setChartData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [xLabels, setXLabels] = useState(weekLabels);
    const [activeButton, setActiveButton] = useState("week");

    useEffect(() => {
        if (selectedRegion !== "none" && selectedService !== "none") {
            const regionData = dataSets[selectedRegion];
            const forecastRegionData = forecastDataSets[selectedRegion];

            if (regionData && regionData[selectedService]) {
                setChartData(regionData[selectedService][activeButton] || []);
                setXLabels(activeButton === "week" ? weekLabels : activeButton === "month" ? monthLabels : yearLabels);
            } else {
                setChartData([]);
                setXLabels([]);
            }

            if (forecastRegionData && forecastRegionData[selectedService]) {
                setForecastData(forecastRegionData[selectedService].future || []);
            } else {
                setForecastData([]);
            }
        } else {
            setChartData([]);
            setXLabels([]);
            setForecastData([]);
        }
    }, [selectedRegion, selectedService, activeButton]);

    return (
        <Container fluid className="analysis-reg-container">
            <div className="analysis-reg">
                <h1>Analysis Registration</h1>

                <div className="drop-down">
                    <DropDownreg selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
                    <DropDownser selectedRegion={selectedRegion} selectedService={selectedService} setSelectedService={setSelectedService} />
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