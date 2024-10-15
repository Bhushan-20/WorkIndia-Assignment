const express = require('express');
const router = express.Router();
const { apiKeyAuth } = require("../middleware/apikeyAuth");

exports.addTrain = (db) => {
    return [apiKeyAuth, (req, res) => {
        try {
            const { train_number, source, destination, total_seats, available_seats, departure_time } = req.body;

            if (!train_number || !source || !destination || total_seats == null || available_seats == null || !departure_time) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                });
            }

            const query = 'INSERT INTO trains (train_number, source, destination, total_seats, available_seats, departure_time) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [train_number, source, destination, total_seats, available_seats, departure_time];

            db.query(query, values, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Database error occurred while adding train',
                        error: err.message,
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "Train added successfully",
                });
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error occurred',
                error: err.message,
            });
        }
    }];
};
