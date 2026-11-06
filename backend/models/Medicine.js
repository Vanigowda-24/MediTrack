
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    dosage: {
        type: String
    },

    foodInstruction: {
        type: String
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    // Low Stock Alert
    lowStockThreshold: {
        type: Number,
        default: 3,
        min: 0
    },

    lowStockAlertEnabled: {
        type: Boolean,
        default: true
    },

    lowStockAlertSent: {
        type: Boolean,
        default: false
    },

    manufacturingDate: {
        type: Date
    },

    expiryDate: {
        type: Date,
        required: true
    },

    reminderEnabled: {
        type: Boolean,
        default: false
    },

    reminderTimes: {
        type: [String],
        default: []
    },

    reminderDays: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

