import React from "react";

const styles = {
  container: {
    marginTop: "20px",
    overflowX: "auto"
  },
  title: {
    fontSize: "clamp(16px, 4vw, 18px)",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "clamp(11px, 2.5vw, 14px)"
  },
  thead: {
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #dee2e6"
  },
  th: {
    padding: "clamp(8px, 2vw, 12px)",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
    fontSize: "clamp(11px, 2.5vw, 14px)"
  },
  tbody: {
    backgroundColor: "#fff"
  },
  tr: {
    borderBottom: "1px solid #dee2e6",
    transition: "background-color 0.2s"
  },
  td: {
    padding: "clamp(8px, 2vw, 12px)",
    color: "#555",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    wordBreak: "break-word"
  },
  price: {
    fontWeight: "600",
    color: "#28a745",
    fontSize: "clamp(11px, 2.5vw, 14px)"
  },
  emptyState: {
    textAlign: "center",
    padding: "clamp(20px, 5vw, 40px)",
    color: "#999",
    fontSize: "clamp(12px, 3vw, 14px)"
  }
};

export default function PricesTable({ data }) {
  if (data.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Все цены</h3>
        <div style={styles.emptyState}>
          Нет данных о ценах
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Все цены</h3>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Сервис</th>
            <th style={styles.th}>Месяц</th>
            <th style={styles.th}>Цена</th>
            <th style={styles.th}>Дата создания</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {data.map(p => (
            <tr key={p.id} style={styles.tr}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>{p.service}</td>
              <td style={styles.td}>{p.year_month}</td>
              <td style={{ ...styles.td, ...styles.price }}>
                {parseFloat(p.price).toFixed(2)} lei
              </td>
              <td style={styles.td}>
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
