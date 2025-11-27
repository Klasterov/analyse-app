"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Services from "./components/services";
import { LineChart } from "@mui/x-charts";
import "./dashboard.css";

export default function Dashboard() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPassword");
        router.push("/LogIn");
    };

    const monthsList = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
                        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

    const [selectedService, setSelectedService] = useState(() => {
        return typeof window !== "undefined" ? localStorage.getItem("selectedService") || "none" : "none";
    });

    const [serviceData, setServiceData] = useState({
        "Gaze naturale": { values: [100, 120, 140], months: ["Ianuarie", "Februarie", "Martie"] },
        "Energie electrica": { values: [200, 250, 300], months: ["Ianuarie", "Februarie", "Martie"] },
        "Energie termica": { values: [50, 70, 90], months: ["Ianuarie", "Februarie", "Martie"] },
        "Apa si canalizare": { values: [30, 40, 50], months: ["Ianuarie", "Februarie", "Martie"] },
    });

    const [currentValue, setCurrentValue] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedData = localStorage.getItem("serviceData");
            if (storedData) {
                try {
                    setServiceData(JSON.parse(storedData));
                } catch (error) {
                    console.error("Eroare la parsarea datelor:", error);
                    localStorage.removeItem("serviceData");
                }
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("serviceData", JSON.stringify(serviceData));
        }
    }, [serviceData]);

    const handleAddValue = () => {
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

        // Găsește ultima lună și generează automat următoarea
        let lastMonthIndex = monthsList.indexOf(updatedServiceData[selectedService].months.slice(-1)[0]);
        let newMonth = monthsList[(lastMonthIndex + 1) % 12]; // Continuă ciclul corect

        updatedServiceData[selectedService].values.push(Number(currentValue));
        updatedServiceData[selectedService].months.push(newMonth);

        // Limitează la ultimele 6 luni
        updatedServiceData[selectedService].values = updatedServiceData[selectedService].values.slice(-6);
        updatedServiceData[selectedService].months = updatedServiceData[selectedService].months.slice(-6);

        setServiceData(updatedServiceData);
        setCurrentValue("");
    };

    const calculateMonthlyUsage = () => {
        if (!serviceData[selectedService] || serviceData[selectedService].values.length < 2) {
            return [];
        }

        return serviceData[selectedService].values.map((value, i, arr) => i === 0 ? 0 : value - arr[i - 1]).slice(1);
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
                <div style={{ marginTop: "40px" , textAlign: "center", color: "white"}}>
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