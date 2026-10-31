const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      feedback
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;