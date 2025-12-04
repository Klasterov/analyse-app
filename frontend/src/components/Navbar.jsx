"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sessionUtils from "../utils/sessionUtils";
import { t, getLanguage } from "../utils/i18n";
import LanguageSelector from "./LanguageSelector";
import "./Navbar.css";
import Link from "next/link";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [remainingTime, setRemainingTime] = useState(null);
    const [language, setLanguage] = useState('ro');
    const router = useRouter();

    useEffect(() => {
        setLanguage(getLanguage());
    }, []);

    // Проверяем сессию при загрузке компонента
    useEffect(() => {
        const checkSession = () => {
            const session = sessionUtils.getActiveSession();
            if (session) {
                setIsAuthenticated(true);
                setUserEmail(session.email);
                setRemainingTime(Math.floor(session.remainingTime / 1000 / 60)); // в минутах
            } else {
                setIsAuthenticated(false);
                setUserEmail("");
                setRemainingTime(null);
            }
        };

        checkSession();
        
        // Обновляем сессию при активности
        const handleActivity = () => {
            sessionUtils.updateSessionTimestamp();
            checkSession();
        };

        window.addEventListener("click", handleActivity);
        window.addEventListener("keypress", handleActivity);
        
        // Обновляем оставшееся время каждую минуту
        const interval = setInterval(checkSession, 60000);
        
        return () => {
            window.removeEventListener("click", handleActivity);
            window.removeEventListener("keypress", handleActivity);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        sessionUtils.clearSession();
        setIsAuthenticated(false);
        setUserEmail("");
        setRemainingTime(null);
        setIsMenuOpen(false);
        router.push("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link href="/">asdpsc</Link>
            </div>
            <button className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                ☰
            </button>
            <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
                <Link href="/About" className="navbar-item">{t('about', language)}</Link>
                <Link href="/analysis-reg" className="navbar-item">{t('analysis', language)}</Link>
                <Link href="/Current" className="navbar-item">{t('current', language)}</Link>
                {isAuthenticated ? (
                    <>
                        <Link href="/dashboard" className="navbar-item">{t('dashboard', language)}</Link>
                        <span className="navbar-item" style={{ fontSize: "12px", color: "#888" }}>
                            {userEmail}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="navbar-item"
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                padding: "0",
                                fontSize: "14px"
                            }}
                        >
                            {t('logout', language)}
                        </button>
                    </>
                ) : (
                    <Link href="/LogIn" className="navbar-item">{t('login', language)}</Link>
                )}
                <li style={{ listStyle: 'none' }}>
                    <LanguageSelector />
                </li>
            </ul>
        </nav>
    );
}