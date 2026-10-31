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
        alert(data.message);
      }
    } catch (error) {
      console.log("Registration error:", error);
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
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
        }}
      >
        <h1>Medicine Tracker</h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Create your account
        </p>

        <form
          onSubmit={handleRegister}
          style={{
            boxShadow: "none",
            padding: "0",
            width: "100%"
          }}
        >
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px"
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;