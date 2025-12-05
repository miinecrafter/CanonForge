import React, { useState } from "react";
import api from "../api";

export default function Register() {
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      await api.post("/api/auth/register", { username, email, password });
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.response?.data?.error || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <input placeholder="username" value={username} onChange={e => setUser(e.target.value)} /><br/>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="password" value={password} onChange={e => setPass(e.target.value)} /><br/>
      <button onClick={submit}>Create Account</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
