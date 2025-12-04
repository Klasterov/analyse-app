"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import api from "../../../api";
import sessionUtils from "../../../utils/sessionUtils";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rememberMe, setRememberMe] = useState(false);
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
        setEmail("");
        setPassword("");
        setName("");
      } else {
        const res = await api.post("/api/auth/login", { email, password });
        newMessages.push("Вход успешен!");
        
        sessionUtils.saveSession(res.data.token, email, res.data.user, rememberMe);
        
        setMessages(newMessages);
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
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
        
        {!isRegistering && (
          <div style={{
            display: "flex",
            alignItems: "center",
            marginTop: "15px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: "8px", cursor: "pointer" }}
            />
            <label htmlFor="rememberMe" style={{ cursor: "pointer", margin: "0" }}>
              Запомнить меня на этом устройстве
            </label>
          </div>
        )}
        
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