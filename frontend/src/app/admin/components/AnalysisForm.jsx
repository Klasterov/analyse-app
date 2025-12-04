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
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(100px, 90vw, 150px), 1fr))",
    gap: "clamp(8px, 2vw, 10px)",
    marginBottom: "15px"
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      borderColor: "#007bff"
    }
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    cursor: "pointer",
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
    maxWidth: "250px",
    "&:hover": {
      backgroundColor: "#218838"
    }
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(clamp(50px, 20vw, 70px), 1fr))",
    gap: "clamp(6px, 1.5vw, 8px)",
    marginTop: "15px"
  },
  valueInput: {
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    textAlign: "center",
    boxSizing: "border-box"
  }
};

export default function AnalysisForm({ 
  region, 
  setRegion, 
  service, 
  setService, 
  period, 
  setPeriod,
  values,
  setValues,
  onSubmit,
  loading
}) {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  const future = ["2028", "2029", "2030", "2031", "2032", "2033", "2034"];

  const getLabels = () => {
    switch(period) {
      case "week": return days;
      case "month": return months;
      case "year": return years;
      case "future": return future;
      default: return [];
    }
  };

  const handleValueChange = (idx, value) => {
    const newValues = [...values];
    newValues[idx] = value;
    setValues(newValues);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Добавить новые данные</h3>
      
      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          placeholder="Регион"
          value={region}
          onChange={e => setRegion(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Сервис"
          value={service}
          onChange={e => setService(e.target.value)}
        />
        <select
          style={styles.select}
          value={period}
          onChange={e => setPeriod(e.target.value)}
        >
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
          <option value="future">Прогноз</option>
        </select>
      </div>

      <div style={styles.valuesGrid}>
        {getLabels().map((label, idx) => (
          <div key={idx}>
            <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>
              {label}
            </label>
            <input
              style={styles.valueInput}
              type="number"
              value={values[idx]}
              onChange={e => handleValueChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        style={styles.button}
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Добавление..." : "Добавить данные"}
      </button>
    </div>
  );
}
