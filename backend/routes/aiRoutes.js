const express = require("express");
const router = express.Router();
const askAi = require("../controllers/aiController");
// const verifyToken = require("../middleware/verifyToken");

router.post("/ask", askAi);

module.exports = router;
