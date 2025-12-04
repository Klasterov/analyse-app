import React from "react";

export default function PricesTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="table-container">
        <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "15px", marginTop: 0, color: "#1e3c72" }}>
          Все цены
        </h3>
        <div className="empty-state">
          Нет данных о ценах
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h3 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: "600", marginBottom: "15px", marginTop: 0, color: "#1e3c72" }}>
        Все цены
      </h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Сервис</th>
            <th>Месяц</th>
            <th>Цена</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.service}</td>
              <td>{p.year_month}</td>
              <td style={{ fontWeight: "600", color: "#2a5298" }}>
                {parseFloat(p.price).toFixed(2)} lei
              </td>
              <td>
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
