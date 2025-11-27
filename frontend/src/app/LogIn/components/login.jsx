"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import "./login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [messages, setMessages] = useState([]);
    const router = useRouter(); // Folosim `useRouter` pentru navigare

    const handleSubmit = () => {
        const newMessages = [];

        if (!email || !password) {
            newMessages.push("Toate câmpurile sunt obligatorii!");
            setMessages(newMessages);
            return;
        }

        if (isRegistering) {
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);
            newMessages.push("Înregistrare reușită! Acum te poți loga.");
            setIsRegistering(false);
        } else {
            const storedEmail = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword");

            if (email === storedEmail && password === storedPassword) {
                newMessages.push("Autentificare reușită!");
                router.push("/dashboard"); // Navigare corectă
            } else {
                newMessages.push("Email sau parolă incorectă!");
            }
        }
        setMessages(newMessages);
    };

    return (
        <Container className="auth-container">
            <div className="login">
                <h2>{isRegistering ? "Înregistrare" : "Logare"}</h2>
                <div className="messages">
                    {messages.map((message, index) => (
                        <p key={index} className="message" style={{ color: message.includes("reușită") ? "green" : "red" }}>
                            {message}
                        </p>
                    ))}
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Parolă"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>
                    {isRegistering ? "Înregistrează-te" : "Logare"}
                </button>
                <p onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Ai deja un cont? Loghează-te!" : "Nu ai cont? Înregistrează-te!"}
                </p>
            </div>
        </Container>
    );
}