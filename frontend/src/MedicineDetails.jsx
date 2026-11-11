

import { QRCodeCanvas } from "qrcode.react";

function MedicineDetails({ medicine, onBack }) {
  if (!medicine) {
    return <p>Medicine not found.</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = medicine.expiryDate
    ? new Date(medicine.expiryDate)
    : null;

  if (expiry) expiry.setHours(0, 0, 0, 0);

  const daysLeft = expiry
    ? Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    : null;

  const status =
    daysLeft === null ? "Not Available" :
    daysLeft < 0 ? "Expired" :
    daysLeft <= 30 ? "Expiring Soon" : "Safe";

  const statusColor =
    status === "Safe" ? "#15803d" :
    status === "Expired" ? "#dc2626" :
    status === "Expiring Soon" ? "#d97706" : "#64748b";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "Not available";

  const details = [
    ["Category", medicine.category, "📂"],
    ["Description", medicine.description, "📝"],
    ["Dosage", medicine.dosage, "💊"],
    ["Food Instruction", medicine.foodInstruction, "🍽️"],
    ["Quantity", medicine.quantity, "📦"],
    ["Manufacturing Date", formatDate(medicine.manufacturingDate), "🏭"],
    ["Expiry Date", formatDate(medicine.expiryDate), "📅"]
  ];

  const qrData = JSON.stringify({
    name: medicine.name,
    category: medicine.category,
    description: medicine.description,
    dosage: medicine.dosage,
    foodInstruction: medicine.foodInstruction,
    quantity: medicine.quantity,
    manufacturingDate: medicine.manufacturingDate,
    expiryDate: medicine.expiryDate
  });

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #eee5f7",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(70,40,100,0.05)"
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f4fc",
      padding: "30px 18px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box"
    }}>

      <div style={{
        maxWidth: "1050px",
        margin: "auto"
      }}>

        <button onClick={onBack} style={{
          background: "#6841a5",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          marginBottom: "22px"
        }}>
          ← Back to Dashboard
        </button>

        <div style={{
          marginBottom: "22px"
        }}>
          <h1 style={{
            color: "#382451",
            fontSize: "30px",
            margin: "0 0 8px"
          }}>
            Medicine Details
          </h1>

          <p style={{
            color: "#82758f",
            margin: 0
          }}>
            View and manage your medicine information
          </p>
        </div>

        {/* Medicine Header */}
        <div style={{
          ...cardStyle,
          background: "linear-gradient(135deg, #6841a5, #9270c7)",
          color: "white",
          marginBottom: "22px",
          padding: "28px"
        }}>
          <p style={{
            margin: "0 0 10px",
            opacity: 0.85,
            fontSize: "13px"
          }}>
            MEDICINE INFORMATION
          </p>

          <h2 style={{
            fontSize: "28px",
            margin: "0 0 15px"
          }}>
            💊 {medicine.name}
          </h2>

          <span style={{
            display: "inline-block",
            background: "white",
            color: statusColor,
            padding: "7px 17px",
            borderRadius: "25px",
            fontSize: "13px",
            fontWeight: "bold"
          }}>
            {status}
          </span>

          <p style={{
            margin: "15px 0 0",
            fontSize: "14px"
          }}>
            {daysLeft === null
              ? "Expiry date not available"
              : daysLeft < 0
              ? `Expired ${Math.abs(daysLeft)} days ago`
              : daysLeft === 0
              ? "Expires today"
              : `${daysLeft} days remaining until expiry`}
          </p>
        </div>

        {/* Medicine Information */}
        <div style={{
          ...cardStyle,
          marginBottom: "22px"
        }}>
          <h3 style={{
            color: "#51317f",
            marginTop: 0,
            marginBottom: "20px"
          }}>
            📋 Medicine Information
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px"
          }}>
            {details.map(([label, value, emoji]) => (
              <div key={label} style={{
                background: "#faf8fd",
                border: "1px solid #eee5f7",
                borderRadius: "12px",
                padding: "18px"
              }}>
                <p style={{
                  color: "#8067a0",
                  fontSize: "13px",
                  margin: "0 0 12px"
                }}>
                  {emoji} {label}
                </p>

                <strong style={{
                  color: "#35234e",
                  fontSize: "15px",
                  overflowWrap: "anywhere"
                }}>
                  {value || "Not available"}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Expiry Tracking */}
        <div style={{
          ...cardStyle,
          marginBottom: "22px"
        }}>
          <h3 style={{
            color: "#51317f",
            marginTop: 0
          }}>
            📅 Expiry Tracking
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px"
          }}>
            <div>
              <p style={{ color: "#82758f", fontSize: "13px" }}>
                Manufacturing Date
              </p>
              <strong style={{ color: "#35234e" }}>
                {formatDate(medicine.manufacturingDate)}
              </strong>
            </div>

            <div>
              <p style={{ color: "#82758f", fontSize: "13px" }}>
                Expiry Date
              </p>
              <strong style={{ color: "#35234e" }}>
                {formatDate(medicine.expiryDate)}
              </strong>
            </div>
          </div>

          <div style={{
            marginTop: "20px",
            background: "#faf8fd",
            borderRadius: "10px",
            padding: "14px",
            borderLeft: `5px solid ${statusColor}`
          }}>
            <strong style={{ color: statusColor }}>
              Expiry Status: {status}
            </strong>
          </div>
        </div>

        {/* QR Code */}
        <div style={{
          ...cardStyle,
          textAlign: "center",
          marginBottom: "22px"
        }}>
          <h3 style={{
            color: "#51317f",
            marginTop: 0
          }}>
            📱 Medicine QR Code
          </h3>

          <p style={{
            color: "#82758f",
            fontSize: "14px"
          }}>
            Scan this code to access the saved medicine information.
          </p>

          <div style={{
            display: "inline-block",
            background: "white",
            padding: "15px",
            border: "1px solid #eee5f7",
            borderRadius: "12px"
          }}>
            <QRCodeCanvas
              value={qrData}
              size={190}
              level="H"
            />
          </div>

          <p style={{
            color: "#82758f",
            fontSize: "12px",
            marginBottom: 0
          }}>
            MediTrack Medicine QR Code
          </p>
        </div>

        <p style={{
          textAlign: "center",
          color: "#9689a3",
          fontSize: "12px"
        }}>
          MediTrack – Medicine Information & Expiry Tracker
        </p>

      </div>
    </div>
  );
}

export default MedicineDetails;
