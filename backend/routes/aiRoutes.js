const express = require("express");
const router = express.Router();
const { askAi, getHistory } = require("../controllers/aiController");
const verifyToken = require("../middleware/verifyToken");

router.post("/ask", verifyToken, askAi);
router.get("/history", verifyToken, getHistory);

module.exports = router;
