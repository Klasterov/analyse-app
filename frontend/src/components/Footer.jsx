import React from "react";
import "./Footer.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2025 asdpsc. Toate drepturile rezervate.</p>
                <ul className="footer-links" >
                    <li><Link href="/About">Despre noi</Link></li>
                    <li><Link href="/analysis-reg">Analiza pe regiune</Link></li>
                    <li><Link href="/Current">Analiza datelor curente</Link></li>
                    <li><Link href="/LogIn">Autentificare</Link></li>
                </ul>
            </div>
        </footer>
    );
}