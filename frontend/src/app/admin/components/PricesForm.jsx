import React from "react";

const styles = {
  container: {
    border: "1px solid #e0e0e0",
    padding: "clamp(12px, 4vw, 20px)",
    borderRadius: "8px",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  },
  title: {
    fontSize: "clamp(16px, 4vw, 18px)",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333"
  },
  monthInput: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(12px, 3vw, 14px)",
    width: "100%",
    maxWidth: "250px",
    marginBottom: "20px",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  pricesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 90vw, 200px), 1fr))",
    gap: "clamp(12px, 3vw, 20px)",
    marginBottom: "20px"
  },
  priceField: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "clamp(12px, 2.5vw, 14px)",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#333"
  },
  priceInput: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  button: {
    padding: "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: "500",
    transition: "background-color 0.2s",
    width: "100%",
    maxWidth: "250px"
  }
};

const services = [
  "Gaze naturale",
  "Energie electrica",
  "Energie termica",
  "Apa si canalizare"
];

export default function PricesForm({
  yearMonth,
  setYearMonth,
  pricesData,
  setPricesData,
  onSubmit,
  loading
}) {
  const handlePriceChange = (service, value) => {
    setPricesData({
      ...pricesData,
      [service]: value
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Добавить цены</h3>
      
      <div>
        <label style={styles.label}>
          Месяц и год (YYYY-MM):
        </label>
        <input
          type="month"
          style={styles.monthInput}
          value={yearMonth}
          onChange={e => setYearMonth(e.target.value)}
        />
      </div>

      <div style={styles.pricesGrid}>
        {services.map(service => (
          <div key={service} style={styles.priceField}>
            <label style={styles.label}>{service}</label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                style={styles.priceInput}
                value={pricesData[service]}
                onChange={e => handlePriceChange(service, e.target.value)}
              />
              <span style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "12px",
                pointerEvents: "none"
              }}>
                lei
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        style={styles.button}
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Сохранение..." : "Сохранить цены"}
      </button>
    </div>
  );
}
