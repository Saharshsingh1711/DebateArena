const express  = require("express");
const router   = express.Router();
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const { authLimiter } = require("../middleware/ratelimiter");

router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);

// Protected route example
router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: `Hello ${req.user.username}!` });
});

module.exports = router;