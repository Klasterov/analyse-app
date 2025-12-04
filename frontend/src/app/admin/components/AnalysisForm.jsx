import React from "react";

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
    <div className="form-group">
      <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "20px", marginTop: 0, color: "#1e3c72" }}>
        Добавить новые данные
      </h3>
      
      <div className="form-row">
        <div className="form-field" style={{ flex: "1" }}>
          <label>Регион</label>
          <input
            type="text"
            placeholder="Введите регион"
            value={region}
            onChange={e => setRegion(e.target.value)}
          />
        </div>
        <div className="form-field" style={{ flex: "1" }}>
          <label>Сервис</label>
          <input
            type="text"
            placeholder="Введите сервис"
            value={service}
            onChange={e => setService(e.target.value)}
          />
        </div>
        <div className="form-field" style={{ flex: "1" }}>
          <label>Период</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
            <option value="future">Прогноз</option>
          </select>
        </div>
      </div>

      <div className="values-input-group">
        {getLabels().map((label, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", flex: "1", minWidth: "60px" }}>
            <label style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#666", marginBottom: "4px", fontWeight: "500" }}>
              {label}
            </label>
            <input
              type="number"
              value={values[idx]}
              onChange={e => handleValueChange(idx, e.target.value)}
              placeholder="0"
              style={{ textAlign: "center" }}
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={loading}
        style={{ marginTop: "20px", width: "100%", maxWidth: "250px" }}
      >
        {loading ? "Добавление..." : "Добавить данные"}
      </button>
    </div>
  );
}
