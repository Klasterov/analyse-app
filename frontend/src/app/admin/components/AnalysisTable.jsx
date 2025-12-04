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
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f8f9fa"
    }
  },
  td: {
    padding: "clamp(8px, 2vw, 12px)",
    color: "#555",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    wordBreak: "break-word"
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "clamp(10px, 2.5vw, 12px)",
    transition: "background-color 0.2s"
  },
  emptyState: {
    textAlign: "center",
    padding: "clamp(20px, 5vw, 40px)",
    color: "#999",
    fontSize: "clamp(12px, 3vw, 14px)"
  }
};

export default function AnalysisTable({ data, onDelete, loading }) {
  if (data.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Все данные анализа</h3>
        <div style={styles.emptyState}>
          Нет данных
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Все данные анализа</h3>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Регион</th>
            <th style={styles.th}>Сервис</th>
            <th style={styles.th}>Период</th>
            <th style={styles.th}>Значения</th>
            <th style={styles.th}>Действие</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {data.map(d => (
            <tr key={d.id} style={styles.tr}>
              <td style={styles.td}>{d.id}</td>
              <td style={styles.td}>{d.region}</td>
              <td style={styles.td}>{d.service}</td>
              <td style={styles.td}>{d.period}</td>
              <td style={styles.td}>{d.values.slice(0, 3).join(", ")}...</td>
              <td style={styles.td}>
                <button
                  style={styles.deleteBtn}
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
