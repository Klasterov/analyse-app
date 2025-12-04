import React from "react";

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
    <div className="form-group">
      <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "20px", marginTop: 0, color: "#1e3c72" }}>
        Добавить цены
      </h3>
      
      <div className="form-row" style={{ marginBottom: "20px" }}>
        <div className="form-field" style={{ flex: "1", maxWidth: "250px" }}>
          <label>Месяц и год</label>
          <input
            type="month"
            value={yearMonth}
            onChange={e => setYearMonth(e.target.value)}
          />
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 90vw, 200px), 1fr))",
        gap: "clamp(12px, 3vw, 20px)",
        marginBottom: "20px"
      }}>
        {services.map(service => (
          <div key={service} className="form-field">
            <label>{service}</label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
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
                pointerEvents: "none",
                fontWeight: "500"
              }}>
                lei
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={loading}
        style={{ width: "100%", maxWidth: "250px" }}
      >
        {loading ? "Сохранение..." : "Сохранить цены"}
      </button>
    </div>
  );
}
