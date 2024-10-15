const express = require('express');
require("dotenv").config();

const API_KEY = process.env.API_KEY;

// API Key Middleware
exports.apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== API_KEY) {
        return res.status(403).json({
            success: false,
            message: "Access denied: Invalid API key.",
        });
    }

    next();
};
