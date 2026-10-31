import { QRCodeCanvas } from "qrcode.react";

function MedicineDetails({ medicine, onBack }) {
    console.log("Selected medicine:", medicine);
  if (!medicine) {
    return <p>Medicine not found.</p>;
  }

  return (
    <div className="app-container">
      <h2>Medicine Details</h2>

      <div className="medicine-card">
        <h2>{medicine.name}</h2>

        <p><strong>Category:</strong> {medicine.category}</p>
        <p><strong>Description:</strong> {medicine.description}</p>
        <p><strong>Dosage:</strong> {medicine.dosage}</p>
        <p><strong>Food Instruction:</strong>{" "}
          {medicine.foodInstruction}</p>
        <p><strong>Quantity:</strong> {medicine.quantity}</p>
        <p>
          <strong>Manufacturing Date:</strong>{" "}
          {medicine.manufacturingDate
    ? new Date(medicine.manufacturingDate).toLocaleDateString()
    : "Not available"}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {medicine.expiryDate
    ? new Date(medicine.expiryDate).toLocaleDateString()
    : "Not available"}
        </p>
        <p>
  <strong>Status:</strong>{" "}
  {(() => {
    const today = new Date();
    const expiry = new Date(medicine.expiryDate);
    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    if (expiry < today) {
      return "Expired";
    } else if (difference <= 30) {
      return "Expiring Soon";
    } else {
      return "Safe";
    }
  })()}
</p>
<div style={{ marginTop: "25px", textAlign: "center" }}>
  <h3>Medicine QR Code</h3>

  <QRCodeCanvas
    value={JSON.stringify({
  name: medicine.name,
  category: medicine.category,
  description: medicine.description,
  dosage: medicine.dosage,
  foodInstruction: medicine.foodInstruction,
  quantity: medicine.quantity,
  manufacturingDate: medicine.manufacturingDate,
  expiryDate: medicine.expiryDate
})}
    size={180}
  />

  <p>Scan this QR code to view medicine information.</p>
</div>

        <button onClick={onBack}>
  ← Back to Dashboard
</button>
      </div>
    </div>
  );
}

export default MedicineDetails;