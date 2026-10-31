
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
        required: true
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

module.exports = mongoose.model("Medicine", medicineSchema);
