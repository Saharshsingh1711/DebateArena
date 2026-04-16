const User   = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");

// ── REGISTER ──────────────────────────────
const register = async (req, res) => {
    console.log("Registration attempt:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.log("Missing fields in registration");
        return res.status(400).json({ message: "Sab fields bharo!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log("User registered successfully:", email);
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error during registration" });
    }
};

// ── LOGIN ─────────────────────────────────
const login = async (req, res) => {
    console.log("Login attempt:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Missing fields in login");
        return res.status(400).json({ message: "Sab fields bharo!" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ message: "Email registered nahi hai!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password for user:", email);
            return res.status(400).json({ message: "Galat password!" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "1d" }
        );

        console.log("Login successful:", email);
        res.status(200).json({
            message: "Login successful!",
            token,
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
};

module.exports = { register, login };