
import { useState } from "react";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        onRegister();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please check that the backend is running.");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "28px 16px",
    background: "linear-gradient(135deg, #fbf7ff, #fffdf9, #f1eafd)"
  };

  const cardStyle = {
    width: "min(100%, 430px)",
    padding: "clamp(26px, 6vw, 42px)",
    borderRadius: "26px",
    background: "#fffdf9",
    border: "1px solid #e8def3",
    boxShadow: "0 18px 48px rgba(51, 35, 82, 0.14)",
    textAlign: "center"
  };

  const inputStyle = {
    width: "100%",
    display: "block",
    padding: "14px 15px",
    margin: "8px 0 18px",
    border: "1px solid #ded3ec",
    borderRadius: "12px",
    background: "#fff",
    color: "#292044",
    fontSize: "15px",
    WebkitTextFillColor: "#292044"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 18px",
    marginTop: "12px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(120deg, #59418a, #8061bd)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer"
  };

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <img
  src="/meditrack-logo.png"
  alt="MediTrack Logo"
  style={{
    width: "100px",
    height: "90px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto 12px"
  }}
/>

        <h1 style={{
          margin: 0,
          color: "#34264f",
          fontSize: "36px",
          lineHeight: 1.2
        }}>
          Medi<span style={{ color: "#8061bd" }}>Track</span>
        </h1>

        <p style={{
          color: "#51476a",
          fontWeight: 600
        }}>
          Track · Remind · Stay Healthy
        </p>

        <p style={{
          color: "#81768f",
          marginBottom: "26px"
        }}>
          Create your personal medicine account
        </p>

        <form
          onSubmit={handleRegister}
          style={{
            width: "100%",
            maxWidth: "none",
            margin: 0,
            padding: 0,
            background: "transparent",
            boxShadow: "none",
            textAlign: "left"
          }}
        >
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            style={inputStyle}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>

        <p style={{
          marginTop: "24px",
          color: "#9288a0",
          fontSize: "12px"
        }}>
          Stay Healthy, Stay Happy ♥
        </p>
      </section>
    </main>
  );
}

export default Register;
