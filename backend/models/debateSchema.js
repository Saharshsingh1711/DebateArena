const mongoose = require("mongoose");

const debateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    personality: { type: String, default: "Standard" },
    response: { 
        // We will store the stringified JSON response payload so it can be parsed easily on the front end
        type: String, 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

const Debate = mongoose.model("Debate", debateSchema);
module.exports = Debate;
