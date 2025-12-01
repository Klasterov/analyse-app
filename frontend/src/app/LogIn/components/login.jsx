"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import api from "../../../api";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const handleSubmit = async () => {
    const newMessages = [];

    if (!email || !password) {
      newMessages.push("Все поля обязательны!");
      setMessages(newMessages);
      return;
    }

    try {
      if (isRegistering) {
        await api.post("/api/auth/register", { name, email, password });
        newMessages.push("Регистрация успешна! Теперь можно войти.");
        setIsRegistering(false);
      } else {
        const res = await api.post("/api/auth/login", { email, password });
        newMessages.push("Вход успешен!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/dashboard");
      }
    } catch (err) {
      if (err.response) {
        newMessages.push(`Ошибка ${err.response.status}: ${err.response.data.error || "Неизвестная ошибка"}`);
      } else {
        newMessages.push("Ошибка сервера");
      }
    }

    setMessages(newMessages);
  };

  return (
    <Container className="auth-container">
      <div className="login">
        <h2>{isRegistering ? "Регистрация" : "Вход"}</h2>
        <div className="messages">
          {messages.map((message, index) => (
            <p
              key={index}
              className="message"
              style={{ color: message.includes("успеш") ? "green" : "red" }}
            >
              {message}
            </p>
          ))}
        </div>

        {isRegistering && (
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {isRegistering ? "Зарегистрироваться" : "Войти"}
        </button>
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Уже есть аккаунт? Войти!" : "Нет аккаунта? Зарегистрируйся!"}
        </p>
      </div>
    </Container>
  );
}