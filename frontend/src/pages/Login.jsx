import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        onLogin(data.user);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7fb"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "15px",
          width: "350px",
          maxWidth: "95%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Medicine Tracker
        </h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Login to continue
        </p>

        <form
          onSubmit={handleLogin}
          style={{
            boxShadow: "none",
            padding: "0",
            width: "100%"
          }}
        >
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              color: "#222",
              backgroundColor: "#fff",
              WebkitTextFillColor: "#222"
            }}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              color: "#222",
              backgroundColor: "#fff",
              WebkitTextFillColor: "#222"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px"
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={onRegister}
            style={{
              width: "100%",
              marginTop: "10px",
              backgroundColor: "#777"
            }}
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;