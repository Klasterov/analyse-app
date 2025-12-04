"use client";
import React, { useState, useEffect } from "react";
import { getLanguages, saveLanguage, getLanguage } from "../utils/i18n";

export default function LanguageSelector() {
  const [language, setLanguage] = useState('ro');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getLanguage();
    setLanguage(saved);
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    saveLanguage(newLang);
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
    }}>
      <label style={{
        fontSize: 'clamp(12px, 2.5vw, 14px)',
        fontWeight: '500',
        color: 'white',
        margin: 0,
      }}>
        🌐
      </label>
      <select
        value={language}
        onChange={handleLanguageChange}
        style={{
          padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          fontSize: 'clamp(11px, 2.5vw, 13px)',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
      >
        {getLanguages().map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
