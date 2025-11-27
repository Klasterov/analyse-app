'use client'
import React from "react";
import { Container } from "react-bootstrap";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import "./current.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const rates = {
    "Gaze naturale": 3.5,
    "Energie electrica": 1.2,
    "Energie termica": 4.8,
    "Apa si canalizare": 2.5
}

const TVA_RATE = 0.8;
const SERVICE_FEE = 10;

export default function Current() {
    const [selectedService, setSelectedService] = React.useState("none");
    const [previousIndex, setPreviousIndex] = React.useState("");
    const [currentIndex, setCurrentIndex] = React.useState("");
    const [amountDue, setAmountDue] = React.useState(0);
    const [tva, setTva] = React.useState(0);

    const handleCalculation = () => {
        if (selectedService !== "none" && previousIndex && currentIndex) {
            const consumption = Math.max(0, currentIndex - previousIndex); // Evită valori negative
            const total = consumption * rates[selectedService];
            const tva = total * TVA_RATE;
            const finalTotal = total + tva + SERVICE_FEE;
            setTva(tva.toFixed(2));
            setAmountDue(finalTotal.toFixed(2));
        }
    };

    return (
        <Container className="payment-container">
            <Row>
                <Col md={6}>
                    <div className="payment-block">
                        <h2>Calculul plății</h2>
                        <Select className="payment-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                            <MenuItem value="none" disabled>Selectează serviciul</MenuItem>
                            {Object.keys(rates).map((service) => (
                                <MenuItem key={service} value={service}>{service}</MenuItem>
                            ))}
                        </Select>
                        <div className="input-block">
                            <label>Indexul precedent:</label>
                            <input className="payment-input" type="number" value={previousIndex} onChange={(e) => setPreviousIndex(Number(e.target.value))} />
                        </div>
                        <div className="input-block">
                            <label>Indexul curent:</label>
                            <input className="payment-input" type="number" value={currentIndex} onChange={(e) => setCurrentIndex(Number(e.target.value))} />
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="checkout">
                        <p>Pret unitate pentru {selectedService}: <span>{rates[selectedService]} lei</span></p>
                        <p>TVA: <span>{tva}</span></p>
                        <p>Deservirea thenica <span>{SERVICE_FEE}</span></p>
                        <h3>Total de achitat:
                             <span>{amountDue} lei</span></h3>
                        <button onClick={handleCalculation}>Calculează suma</button>
                    </div>
                </Col>
            </Row>
        </Container>

    );
}
