const express = require("express");
const Medicine = require("../models/Medicine");

const router = express.Router();

// Add a new medicine
router.post("/", async (req, res) => {
    try {
        console.log("Received medicine data:", req.body);
        const { userId, ...medicineData } = req.body;

        const medicine = new Medicine({
            userId,
            ...medicineData
        });

        const savedMedicine = await medicine.save();

        res.status(201).json(savedMedicine);
    } catch (error) {
        console.log("Medicine save error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get all medicines
router.get("/", async (req, res) => {
    try {
const medicines = await Medicine.find();        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a medicine
router.put("/:id", async (req, res) => {
    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
);

        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a medicine
router.delete("/:id", async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);

        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;