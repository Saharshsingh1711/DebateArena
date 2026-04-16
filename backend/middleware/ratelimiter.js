const rateLimit = require("express-rate-limit");

// Auth routes ke liye limiter — register aur login
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes ka window
    max: 10,                    // sirf 10 requests allow hain is window mein
    message: {
        message: "Bahut zyada requests! 15 minute baad try karo."
    }
});


module.exports = { authLimiter };