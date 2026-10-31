const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

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
    }
});

module.exports = mongoose.model("Medicine", medicineSchema);