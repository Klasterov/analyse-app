'use client'
import React from "react";
import { Container } from "react-bootstrap";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import "./current.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import api from "../../api";
import sessionUtils from "../../utils/sessionUtils";
import { t, getLanguage } from "../../utils/i18n";

const TVA_RATE = 0.8;
const SERVICE_FEE = 10;

const serviceMapping = {
    "Gaze naturale": "last_gaze_reading",
    "Energie electrica": "last_electricity_reading",
    "Energie termica": "last_heat_reading",
    "Apa si canalizare": "last_water_reading"
};

export default function Current() {
    const [rates, setRates] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [selectedService, setSelectedService] = React.useState("none");
    const [previousIndex, setPreviousIndex] = React.useState("");
    const [currentIndex, setCurrentIndex] = React.useState("");
    const [amountDue, setAmountDue] = React.useState(0);
    const [tva, setTva] = React.useState(0);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [lastReadingDate, setLastReadingDate] = React.useState(null);
    const [lastReadings, setLastReadings] = React.useState({});
    const [showSaveOption, setShowSaveOption] = React.useState(false);
    const [language, setLanguage] = React.useState('ro');

    React.useEffect(() => {
        setLanguage(getLanguage());
    }, []);

    React.useEffect(() => {
        const lastSeenRef = React.createRef();

        const fetchData = async () => {
            try {
                setLoading(true);
                const pricesResponse = await api.get('/api/prices/current');
                setRates(pricesResponse.data);
                const session = sessionUtils.getActiveSession();

                if (session && session.token) {
                    try {
                        const readingsResponse = await api.get('/api/readings/last', {
                            headers: { Authorization: `Bearer ${session.token}` }
                        });

                        if (readingsResponse.data) {
                            setIsAuthenticated(true);
                            const readings = readingsResponse.data.readings || {};

                            setLastReadings(readings);

                            if (readingsResponse.data.lastReadingDate) {
                                const formattedDate = new Date(readingsResponse.data.lastReadingDate).toLocaleDateString();
                                setLastReadingDate(formattedDate);
                            }

                            setShowSaveOption(true);
                            sessionUtils.updateSessionTimestamp();
                            const now = Date.now().toString();
                            localStorage.setItem('lastReadingsUpdated', now);
                            lastSeenRef.current = now;
                        }
                    } catch (readingsErr) {
                        console.error('Error fetching readings:', readingsErr);
                        if (readingsErr.response) {
                            console.error('Response status:', readingsErr.response.status);
                            console.error('Response data:', readingsErr.response.data);
                        }
                    }
                } else {
                    console.log('No active session found');
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
                setRates({
                    "Gaze naturale": 3.5,
                    "Energie electrica": 1.2,
                    "Energie termica": 4.8,
                    "Apa si canalizare": 2.5
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const handleStorage = (e) => {
            if (e.key === 'lastReadingsUpdated') {
                console.log('Detected readings update via storage event:', e.newValue);
                if (!lastSeenRef.current || lastSeenRef.current !== e.newValue) {
                    lastSeenRef.current = e.newValue;
                    fetchData();
                }
            }
        };

        window.addEventListener('storage', handleStorage);

        const pollInterval = setInterval(() => {
            const marker = localStorage.getItem('lastReadingsUpdated');
            if (marker && marker !== lastSeenRef.current) {
                console.log('Detected readings update via polling:', marker);
                lastSeenRef.current = marker;
                fetchData();
            }
        }, 15000);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(pollInterval);
        };
    }, []);

    // When user selects a service, populate the previous index from fetched readings
    React.useEffect(() => {
        if (selectedService && selectedService !== 'none' && lastReadings) {
            const val = lastReadings[selectedService];
            if (val != null) {
                setPreviousIndex(val);
            }
        }
    }, [selectedService, lastReadings]);

    const handleCalculation = () => {
        if (selectedService !== "none" && previousIndex && currentIndex) {
            const consumption = Math.max(0, currentIndex - previousIndex);
            const total = consumption * rates[selectedService];
            const tva = total * TVA_RATE;
            const finalTotal = total + tva + SERVICE_FEE;
            setTva(tva.toFixed(2));
            setAmountDue(finalTotal.toFixed(2));
        }
    };

    const handleSaveReadings = async () => {
        try {
            const session = sessionUtils.getActiveSession();
            if (!session) {
                alert("Пожалуйста, авторизуйтесь для сохранения показаний");
                return;
            }

            // Only update the selected service to avoid overwriting other services with null
            if (!selectedService || selectedService === 'none') {
                alert('Пожалуйста, выберите услугу для сохранения показаний');
                return;
            }

            if (currentIndex === '' || currentIndex === null || isNaN(Number(currentIndex))) {
                alert('Пожалуйста, введите корректные текущие показания');
                return;
            }

            const readings = {};
            readings[selectedService] = Number(currentIndex);

            await api.post(
                '/api/readings/save',
                { readings },
                { headers: { Authorization: `Bearer ${session.token}` } }
            );

            alert("Показания сохранены! При следующем входе они загрузятся автоматически");
            const now = new Date().toLocaleDateString();
            setLastReadingDate(now);
            sessionUtils.updateSessionTimestamp();
            try {
                const marker = Date.now().toString();
                localStorage.setItem('lastReadingsUpdated', marker);
                console.log('Wrote lastReadingsUpdated marker:', marker);
            } catch (e) {
                console.warn('Could not write lastReadingsUpdated to localStorage', e);
            }
        } catch (err) {
            console.error('Ошибка при сохранении показаний:', err);
            alert("✗ Ошибка при сохранении показаний");
        }
    };

    return (
        <Container className="payment-container">
            {isAuthenticated && lastReadingDate && (
                <div style={{
                    backgroundColor: "#e8f5e9",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    color: "#2e7d32",
                    textAlign: "center"
                }}>
                    {t('myReadings', language)}: <strong>{lastReadingDate}</strong>
                </div>
            )}
            
            <Row>
                <Col md={6}>
                    <div className="payment-block">
                        <h2>{t('calculate', language)}</h2>
                        <Select className="payment-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                            <MenuItem value="none" disabled>{t('selectService', language)}</MenuItem>
                            {Object.keys(rates).map((service) => (
                                <MenuItem key={service} value={service}>{service}</MenuItem>
                            ))}
                        </Select>
                        <div className="input-block">
                            <label>{t('previousReading', language)}:</label>
                            <input 
                                className="payment-input" 
                                type="number" 
                                value={previousIndex} 
                                onChange={(e) => setPreviousIndex(Number(e.target.value))}
                                placeholder="Автоматически заполнено" 
                            />
                        </div>
                        <div className="input-block">
                            <label>{t('currentReading', language)}:</label>
                            <input 
                                className="payment-input" 
                                type="number" 
                                value={currentIndex} 
                                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                                placeholder={t('currentReading', language)} 
                            />
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="checkout">
                        <p>{t('price', language)} {selectedService}: <span>{rates[selectedService] ? rates[selectedService] : '-'} {t('lei', language)}</span></p>
                        <p>TVA: <span>{tva}</span></p>
                        <p>{t('amount', language)} <span>{SERVICE_FEE}</span></p>
                        <h3>{t('total', language)}:
                             <span>{amountDue} {t('lei', language)}</span></h3>
                        <button onClick={handleCalculation}>{t('calculate', language)}</button>
                        {isAuthenticated && currentIndex && (
                            <button 
                                onClick={handleSaveReadings}
                                style={{
                                    marginTop: "10px",
                                    backgroundColor: "#4caf50",
                                    width: "100%",
                                    padding: "10px",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "30px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                {t('save', language)}
                            </button>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>

    );
}
