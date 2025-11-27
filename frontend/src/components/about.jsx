import React from "react";
import "./about.css";
import Link from "next/link";
import { Container } from "react-bootstrap";

export default function AboutContent() {
    return (
        <Container maxwidth="sm" className="about-container">
        <div>
            <h1>Despre noi</h1>
            <div className="text-content">
                <p>ASDPSC este o platformă dedicată analizei statistice a datelor comunale, oferind utilizatorilor informații detaliate despre taxele și serviciile publice. Printr-o abordare bazată pe date, ajutăm cetățenii și autoritățile locale să înțeleagă mai bine costurile asociate utilităților și să ia decizii informate.</p>
                <p>Pe platforma noastră, utilizatorii pot:</p>
                <p><span>Calcula taxele comunale pentru</span> apă, electricitate, salubrizare și alte servicii esențiale.</p>
                <p><span>Analiza tendințele și evoluțiile</span> tarifelor în diferite regiuni ale Republicii Moldova.</p>
                <p><span>Accesa vizualizări interactive</span> cu grafice și statistici clare despre fluctuațiile taxelor.</p>
                <p><span>Compara costurile</span> între localități pentru o mai bună planificare financiară.</p>
                <p><span>Obține previziuni și recomandări</span> pentru optimizarea consumului și reducerea cheltuielilor.</p>
                <p>Ne propunem să aducem mai multă transparență în gestionarea taxelor comunale și să oferim utilizatorilor un instrument practic pentru a-și administra mai eficient bugetul.</p>
            </div>
        </div>
        </Container>
    );
}
