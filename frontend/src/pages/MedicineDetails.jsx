
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
    status === "Safe" ? "#218838" :
    status === "Expired" ? "#dc3545" :
    status === "Expiring Soon" ? "#d97706" : "#777";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "Not available";

  const details = [
    ["Category", medicine.category],
    ["Description", medicine.description],
    ["Dosage", medicine.dosage],
    ["Food Instruction", medicine.foodInstruction],
    ["Quantity", medicine.quantity],
    ["Manufacturing Date", formatDate(medicine.manufacturingDate)],
    ["Expiry Date", formatDate(medicine.expiryDate)]
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f4ff",
      padding: "35px 20px",
      fontFamily: "Arial, sans-serif"
    }}>

      <div style={{
        maxWidth: "1000px",
        margin: "auto"
      }}>

        <button onClick={onBack} style={{
          background: "#6b42a5",
          color: "white",
          border: "none",
          padding: "12px 22px",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "25px",
          fontSize: "15px"
        }}>
          ← Back to Dashboard
        </button>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 5px 25px rgba(80,50,120,0.10)"
        }}>

          <h1 style={{
            color: "#51317f",
            marginTop: "0",
            marginBottom: "8px"
          }}>
            Medicine Details
          </h1>

          <p style={{ color: "#888", marginBottom: "25px" }}>
            Complete information about your medicine
          </p>

          <div style={{
            background: "#f2eaff",
            padding: "22px",
            borderRadius: "14px",
            marginBottom: "25px"
          }}>
            <h2 style={{
              color: "#51317f",
              margin: "0 0 12px"
            }}>
              💊 {medicine.name}
            </h2>

            <span style={{
              background: statusColor,
              color: "white",
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold"
            }}>
              {status}
            </span>

            {daysLeft !== null && daysLeft >= 0 && (
              <p style={{ color: "#65458c", marginBottom: "0" }}>
                {daysLeft === 0
                  ? "Expires today"
                  : `${daysLeft} days remaining until expiry`}
              </p>
            )}
          </div>

          <h3 style={{ color: "#51317f" }}>
            📋 Medicine Information
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px"
          }}>
            {details.map(([label, value]) => (
              <div key={label} style={{
                background: "#fcfaff",
                border: "1px solid #eadff7",
                borderRadius: "12px",
                padding: "17px"
              }}>
                <p style={{
                  color: "#8067a0",
                  fontSize: "13px",
                  margin: "0 0 8px"
                }}>
                  {label}
                </p>

                <strong style={{
                  color: "#35234e",
                  overflowWrap: "anywhere"
                }}>
                  {value || "Not available"}
                </strong>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: "30px",
            padding: "25px",
            background: "#faf7ff",
            border: "1px solid #eadff7",
            borderRadius: "15px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#51317f" }}>
              📱 Medicine QR Code
            </h3>

            <QRCodeCanvas
              value={qrData}
              size={180}
              level="H"
            />

            <p style={{ color: "#777", fontSize: "13px" }}>
              Scan this QR code to view medicine information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;
