import { useState } from "react";
function Feedback({ onBack }) {
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/feedback",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          feedback
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      setName("");
      setEmail("");
      setFeedback("");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Feedback error:", error);
    alert("Something went wrong");
  }
};
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [feedback, setFeedback] = useState("");
  return (
    <div className="app-container">
      <h2>Feedback</h2>

      <form onSubmit={handleSubmit}>
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

        <label>Feedback</label>
        <textarea
  placeholder="Write your feedback here..."
  rows="5"
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  required
></textarea>

        <button type="submit">
          Submit Feedback
        </button>
        <button type="button" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </form>
    </div>
  );
}

export default Feedback;