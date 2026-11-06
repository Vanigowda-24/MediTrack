const express = require("express");
const router = express.Router();

const {
  subscribe
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/subscribe", authMiddleware, subscribe);

module.exports = router;
