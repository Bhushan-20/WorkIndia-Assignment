const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

exports.register = (db) => async (req, res) => {
    
    try {
        const { name, email, phone_number, password, role } = req.body;
        if (!name || !email || !phone_number || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, email, phone number, password, role) are required",
            });
        }
        console.log("I am here");
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error occurred',
                    error: err.message,
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists. Please sign in.",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO users (name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone_number, hashedPassword, role],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Database error occurred during registration',
                            error: err.message,
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "User registered successfully",
                    });
                }
            );
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error occurred',
            error: err.message,
        });
    }
};

exports.login = (db) => async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in both email and password fields",
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error occurred',
                    error: err.message,
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not registered. Please sign up first.",
                });
            }

            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign(
                    { email: user.email, id: user.id, role: user.role },
                    process.env.JWT_SECRET || "defaultsecret",
                    { expiresIn: '24h' }
                );

                const options = {
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie('token', token, options).status(200).json({
                    success: true,
                    token,
                    user: { id: user.id, email: user.email, role: user.role },
                    message: "User login successful",
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect password",
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure. Please try again.",
        });
    }
};

