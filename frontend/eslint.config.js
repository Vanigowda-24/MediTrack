
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicineDetails from "./pages/MedicineDetails";
import Feedback from "./pages/Feedback";

const initialMedicine = {
  name: "",
  category: "",
  description: "",
  dosage: "",
  foodInstruction: "",
  quantity: "",
  manufacturingDate: "",
  expiryDate: "",
  reminderEnabled: false,
  reminderTimes: [],
  reminderDays: []
};

const weekdays = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday"
];
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const enableNotifications = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Please allow notifications in your browser.");
      return;
    }

    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );

    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!publicKey) {
      alert("VAPID public key is missing.");
      return;
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const response = await fetch(
      "http://localhost:5000/api/notifications/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(subscription)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Subscription failed");
    }

    alert("Push notifications enabled successfully!");

  } catch (error) {
    console.error("Notification error:", error);
    alert("Notification setup failed: " + error.message);
  }
};

  const [medicine, setMedicine] = useState({ ...initialMedicine });
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  // Check expiry status
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);

    if (daysLeft < 0) return "Expired";
    if (daysLeft <= 30) return "Expiring Soon";
    return "Safe";
  };

  // Dashboard calculations
  const totalMedicines = medicines.length;

  const safeMedicines = medicines.filter(
    item => getExpiryStatus(item.expiryDate) === "Safe"
  ).length;

  const expiringSoonMedicines = medicines.filter(
    item => getExpiryStatus(item.expiryDate) === "Expiring Soon"
  ).length;

  const expiredMedicines = medicines.filter(
    item => getExpiryStatus(item.expiryDate) === "Expired"
  ).length;

  const tabletMedicines = medicines.filter(
    item => item.category?.toLowerCase() === "tablet"
  ).length;

  const capsuleMedicines = medicines.filter(
    item => item.category?.toLowerCase() === "capsule"
  ).length;

  // Fetch medicines
  const fetchMedicines = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/medicines"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch medicines");
      }

      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    if (user) fetchMedicines();
  }, [user]);

  // Handle normal form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add reminder time
  const addReminderTime = () => {
    setMedicine(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, "08:00"]
    }));
  };

  // Update reminder time
  const updateReminderTime = (index, value) => {
    setMedicine(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((time, i) =>
        i === index ? value : time
      )
    }));
  };

  // Remove reminder time
  const removeReminderTime = (index) => {
    setMedicine(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter(
        (_, i) => i !== index
      )
    }));
  };

  // Select reminder days
  const toggleReminderDay = (day) => {
    setMedicine(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day]
    }));
  };

  // Clear form
  const clearForm = () => {
    setEditingId(null);
    setMedicine({ ...initialMedicine });
  };

  // Add or update medicine
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (medicine.reminderEnabled) {
      if (medicine.reminderTimes.length === 0) {
        alert("Please add at least one reminder time.");
        return;
      }

      if (medicine.reminderDays.length === 0) {
        alert("Please select at least one reminder day.");
        return;
      }
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/medicines/${editingId}`
        : "http://localhost:5000/api/medicines";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...medicine,
          userId: user.id,
          quantity: Number(medicine.quantity)
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editingId
            ? "Medicine updated successfully!"
            : "Medicine added successfully!"
        );

        clearForm();
        await fetchMedicines();
      } else {
        alert(data.message || "Unable to save medicine.");
      }
    } catch (error) {
      console.log("Error saving medicine:", error);
      alert("Error connecting to backend.");
    }
  };

  // Delete medicine
  const deleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Medicine deleted successfully!");

        setMedicines(prev =>
          prev.filter(item => item._id !== id)
        );
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (error) {
      console.log("Error deleting medicine:", error);
      alert("Something went wrong while deleting.");
    }
  };

  // Edit medicine
  const editMedicine = (item) => {
    setEditingId(item._id);

    setMedicine({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      dosage: item.dosage || "",
      foodInstruction: item.foodInstruction || "",
      quantity: item.quantity ?? "",
      manufacturingDate: item.manufacturingDate
        ? item.manufacturingDate.substring(0, 10)
        : "",
      expiryDate: item.expiryDate
        ? item.expiryDate.substring(0, 10)
        : "",
      reminderEnabled: item.reminderEnabled || false,
      reminderTimes: item.reminderTimes || [],
      reminderDays: item.reminderDays || []
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMedicines([]);
    clearForm();
  };

  // Login screen
  if (!user) {
    if (showRegister) {
      return (
        <Register onRegister={() => setShowRegister(false)} />
      );
    }

    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
        }}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  // Medicine details
  if (selectedMedicine) {
    return (
      <MedicineDetails
        medicine={selectedMedicine}
        onBack={() => setSelectedMedicine(null)}
      />
    );
  }

  // Feedback
  if (showFeedback) {
    return <Feedback onBack={() => setShowFeedback(false)} />;
  }

  return (
    <div className="app-container">

      <button onClick={logout}>Logout</button>
      <button onClick={enableNotifications}>
  Enable Push Notifications 🔔
</button>

      <button onClick={() => setShowFeedback(true)}>
        Feedback
      </button>

      <header className="app-header">
        <h1>Medicine Information & Expiry Tracker</h1>
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

<h1>MediTrack</h1>
        <p>Welcome, {user?.name}! 👋</p>
        <p>Logged in as: {user?.email}</p>
        <p>Manage your medicines and track their expiry dates</p>
      </header>

      {/* Add Medicine Form */}
      <h2>{editingId ? "Edit Medicine" : "Add Medicine"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          value={medicine.name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={medicine.category}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={medicine.description}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={medicine.dosage}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="foodInstruction"
          value={medicine.foodInstruction}
          onChange={handleChange}
        >
          <option value="">Select Food Instruction</option>
          <option value="Before food">Before food</option>
          <option value="After food">After food</option>
          <option value="With food">With food</option>
          <option value="As directed">As directed</option>
        </select>

        <br /><br />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={medicine.quantity}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Manufacturing Date:</label>
        <input
          type="date"
          name="manufacturingDate"
          value={medicine.manufacturingDate}
          onChange={handleChange}
        />

        <br /><br />

        <label>Expiry Date:</label>
        <input
          type="date"
          name="expiryDate"
          value={medicine.expiryDate}
          onChange={handleChange}
          required
        />

        <br /><br />

        {/* Medicine Reminder Settings */}
        <hr />
        <h3>Medicine Reminder Settings</h3>

        <label>
          <input
            type="checkbox"
            checked={medicine.reminderEnabled}
            onChange={(e) =>
              setMedicine(prev => ({
                ...prev,
                reminderEnabled: e.target.checked
              }))
            }
          />
          Enable Medicine Reminder
        </label>

        <br /><br />

        <label>Reminder Times:</label>

        {medicine.reminderTimes.map((time, index) => (
          <div key={index}>
            <input
  type="time"
  step="60"
  value={time}
  disabled={!medicine.reminderEnabled}
  onChange={(e) =>
    updateReminderTime(index, e.target.value)
  }
  style={{
    color: "#222",
    backgroundColor: "#fff",
    width: "180px"
  }}
/>

            <button
              type="button"
              disabled={!medicine.reminderEnabled}
              onClick={() => removeReminderTime(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <br />

        <button
          type="button"
          disabled={!medicine.reminderEnabled}
          onClick={addReminderTime}
        >
          + Add Reminder Time
        </button>

        <br /><br />

        <label>Reminder Days:</label>

        {weekdays.map(day => (
          <label key={day} style={{ display: "block" }}>
            <input
              type="checkbox"
              disabled={!medicine.reminderEnabled}
              checked={medicine.reminderDays.includes(day)}
              onChange={() => toggleReminderDay(day)}
            />
            {day}
          </label>
        ))}

        <br />

        <button type="submit">
          {editingId ? "Update Medicine" : "Add Medicine"}
        </button>

        <button
          className="clear-button"
          type="button"
          onClick={clearForm}
        >
          Clear
        </button>

      </form>

      <hr />

      {/* Dashboard */}
      <h2>Dashboard</h2>

      <div className="dashboard">
        <div className="card">
          <h3>Total Medicines</h3>
          <p>{totalMedicines}</p>
        </div>

        <div className="card">
          <h3>Safe</h3>
          <p>{safeMedicines}</p>
        </div>

        <div className="card">
          <h3>Expiring Soon</h3>
          <p>{expiringSoonMedicines}</p>
        </div>

        <div className="card">
          <h3>Expired</h3>
          <p>{expiredMedicines}</p>
        </div>

        <div className="card">
          <h3>Tablets</h3>
          <p>{tabletMedicines}</p>
        </div>

        <div className="card">
          <h3>Capsules</h3>
          <p>{capsuleMedicines}</p>
        </div>
      </div>

      <hr />

      {/* Medicine List */}
      <h2>My Medicines</h2>

      <input
        className="search-box"
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Medicines</option>
        <option value="Safe">Safe</option>
        <option value="Expiring Soon">Expiring Soon</option>
        <option value="Expired">Expired</option>
      </select>

      <br /><br />

      {medicines
        .filter(item =>
          item.name?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(item =>
          statusFilter === "All"
            ? true
            : getExpiryStatus(item.expiryDate) === statusFilter
        )
        .map(item => (
          <div className="medicine-card" key={item._id}>

            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <p>Description: {item.description}</p>
            <p>Dosage: {item.dosage}</p>
            <p>Food Instruction: {item.foodInstruction}</p>
            <p>Quantity: {item.quantity}</p>
            
<label>Low Stock Alert Limit:</label>
<input
  type="number"
  name="lowStockThreshold"
  placeholder="Alert when stock reaches"
  value={medicine.lowStockThreshold}
  onChange={handleChange}
  min="0"
  required
/>

<br /><br />


            <p>
              Manufacturing Date:{" "}
              {item.manufacturingDate
                ? new Date(item.manufacturingDate).toLocaleDateString("en-GB")
                : "N/A"}
            </p>

            <p>
              Expiry Date:{" "}
              {new Date(item.expiryDate).toLocaleDateString("en-GB")}
            </p>

            <p>
              Status:{" "}
              <span style={{
                color:
                  getExpiryStatus(item.expiryDate) === "Expired"
                    ? "red"
                    : getExpiryStatus(item.expiryDate) === "Expiring Soon"
                    ? "orange"
                    : "green",
                fontWeight: "bold"
              }}>
                {getExpiryStatus(item.expiryDate)}
              </span>
            </p>

            <p>
              Reminder: {item.reminderEnabled ? "Enabled" : "Disabled"}
            </p>

            {item.reminderEnabled && (
              <>
                <p>
                  Reminder Times: {item.reminderTimes?.join(", ")}
                </p>

                <p>
                  Reminder Days: {item.reminderDays?.join(", ")}
                </p>
              </>
            )}

            <button onClick={() => setSelectedMedicine(item)}>
              View Details
            </button>

            <button onClick={() => editMedicine(item)}>
              Edit
            </button>

            <button onClick={() => deleteMedicine(item._id)}>
              Delete
            </button>

            <hr />
          </div>
        ))}

    </div>
  );
}

export default App;
