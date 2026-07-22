// models/tokenBlacklist.model.js
const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true,"Token is required to be blacklist"],
        unique: true,
    },

},{timestamps:true});

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema);