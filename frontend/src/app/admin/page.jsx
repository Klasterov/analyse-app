"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [region, setRegion] = useState("");
  const [service, setService] = useState("");
  const [period, setPeriod] = useState("week");

  const [weekValues, setWeekValues] = useState(Array(7).fill(""));
  const [monthValues, setMonthValues] = useState(Array(12).fill(""));
  const [yearValues, setYearValues] = useState(Array(7).fill(""));
  const [futureValues, setFutureValues] = useState(Array(7).fill(""));

  const [data, setData] = useState([]);

  const API_URL = "http://localhost:5000/api/analysis";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      let finalValues;

      if (period === "week") {
        finalValues = weekValues.map(v => Number(v) || 0);
      } else if (period === "month") {
        finalValues = monthValues.map(v => Number(v) || 0);
      } else if (period === "year") {
        finalValues = yearValues.map(v => Number(v) || 0);
      } else if (period === "future") {
        finalValues = futureValues.map(v => Number(v) || 0);
      }

      await axios.post(API_URL, {
        region,
        service,
        period,
        values: finalValues,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // сброс
      setRegion("");
      setService("");
      setPeriod("week");
      setWeekValues(Array(7).fill(""));
      setMonthValues(Array(12).fill(""));
      setYearValues(Array(7).fill(""));
      setFutureValues(Array(7).fill(""));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении данных");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении данных");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Админка: управление данными</h2>
      <div>
        <input placeholder="Регион" value={region} onChange={e => setRegion(e.target.value)} />
        <input placeholder="Сервис" value={service} onChange={e => setService(e.target.value)} />
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
          <option value="future">Прогноз</option>
        </select>

        {period === "week" && (
          <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day, idx) => (
              <input
                key={idx}
                placeholder={day}
                value={weekValues[idx]}
                onChange={e => {
                  const newValues = [...weekValues];
                  newValues[idx] = e.target.value;
                  setWeekValues(newValues);
                }}
                style={{ width: "60px" }}
              />
            ))}
          </div>
        )}

        {period === "month" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
            {["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"].map((m, idx) => (
              <input
                key={idx}
                placeholder={m}
                value={monthValues[idx]}
                onChange={e => {
                  const newValues = [...monthValues];
                  newValues[idx] = e.target.value;
                  setMonthValues(newValues);
                }}
                style={{ width: "60px" }}
              />
            ))}
          </div>
        )}

        {period === "year" && (
          <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
            {["2021","2022","2023","2024","2025","2026","2027"].map((y, idx) => (
              <input
                key={idx}
                placeholder={y}
                value={yearValues[idx]}
                onChange={e => {
                  const newValues = [...yearValues];
                  newValues[idx] = e.target.value;
                  setYearValues(newValues);
                }}
                style={{ width: "70px" }}
              />
            ))}
          </div>
        )}

        {period === "future" && (
          <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
            {["2028","2029","2030","2031","2032","2033","2034"].map((y, idx) => (
              <input
                key={idx}
                placeholder={y}
                value={futureValues[idx]}
                onChange={e => {
                  const newValues = [...futureValues];
                  newValues[idx] = e.target.value;
                  setFutureValues(newValues);
                }}
                style={{ width: "70px" }}
              />
            ))}
          </div>
        )}

        <button onClick={handleSubmit}>Добавить</button>
      </div>

      <h3>Все данные</h3>
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Регион</th>
            <th>Сервис</th>
            <th>Период</th>
            <th>Значения</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.region}</td>
              <td>{d.service}</td>
              <td>{d.period}</td>
              <td>{d.values.join(", ")}</td>
              <td><button onClick={() => handleDelete(d.id)}>Удалить</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}