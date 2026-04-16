const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
console.log("--- Debugging Start ---");
    // Token header mein aata hai — "Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token nahi mila!" });
    }

    try {
        console.log( process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token galat hai!" });
    }
};

module.exports = verifyToken;