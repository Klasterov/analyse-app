"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./Navbar.css";
import Link from "next/link";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter(); // Adaugă router-ul pentru monitorizarea rutei

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userEmail = localStorage.getItem("userEmail");
            setIsAuthenticated(!!userEmail);
        }
    }, []);

    // Detectează schimbarea rutei și închide meniul
    useEffect(() => {
        const handleRouteChange = () => {
            setIsMenuOpen(false); // Închide meniul când se schimbă pagina
        };

        router.events?.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events?.off("routeChangeComplete", handleRouteChange);
        };
    }, [router]);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link href="/">asdpsc</Link>
            </div>
            <button className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰
            </button>
            <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
                <Link href="/About" className="navbar-item">Despre noi</Link>
                <Link href="/analysis-reg" className="navbar-item">Analiza pe regiune</Link>
                <Link href="/Current" className="navbar-item">Analiza datelor curente</Link>
                {isAuthenticated ? (
                    <Link href="/dashboard" className="navbar-item">Dashboard</Link>
                ) : (
                    <Link href="/LogIn" className="navbar-item">Logare</Link>
                )}
            </ul>
        </nav>
    );
}