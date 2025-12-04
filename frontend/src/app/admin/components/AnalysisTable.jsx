import React from "react";

export default function AnalysisTable({ data, onDelete, loading }) {
  if (data.length === 0) {
    return (
      <div className="table-container">
        <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "15px", marginTop: 0, color: "#1e3c72" }}>
          Все данные анализа
        </h3>
        <div className="empty-state">
          Нет данных
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "15px", marginTop: 0, color: "#1e3c72" }}>
        Все данные анализа
      </h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Регион</th>
            <th>Сервис</th>
            <th>Период</th>
            <th>Значения</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.region}</td>
              <td>{d.service}</td>
              <td>{d.period}</td>
              <td>{d.values.slice(0, 3).join(", ")}...</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(d.id)}
                  disabled={loading}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
