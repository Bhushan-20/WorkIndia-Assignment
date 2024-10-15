const express = require('express');
const router = express.Router();


exports.getTrains = (db) => async (req, res) => {
    const { source, destination } = req.body;

    // Check for missing parameters
    if (!source || !destination) {
        return res.status(400).json({
            success: false,
            message: "Source and destination are required",
        });
    }

    // Query to fetch trains from the database
    const query = `
        SELECT train_number, source, destination, total_seats, available_seats, departure_time 
        FROM trains 
        WHERE source = ? AND destination = ?
    `;

    db.query(query, [source, destination], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error occurred while fetching trains",
                error: err.message,
            });
        }

        // Check if any trains were found
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No trains found for the given route",
            });
        }

        // Return the results
        return res.status(200).json({
            success: true,
            trains: results,
        });
    });
};


exports.bookSeat = (db) => async (req, res) => {
    const { train_number, seats_to_book } = req.body;
    const user_id = req.user.id;

    if (!train_number || !seats_to_book) {
        return res.status(400).json({
            success: false,
            message: "Train number and number of seats to book are required",
        });
    }

    const checkTrainQuery = `
        SELECT id, available_seats, departure_time, train_number, source, destination
        FROM trains 
        WHERE train_number = ?
    `;

    db.query(checkTrainQuery, [train_number], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error checking seat availability",
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Train not found",
            });
        }

        const train_id = results[0].id;
        const availableSeats = results[0].available_seats;
        const { departure_time, train_number, source, destination } = results[0];

        if (seats_to_book > availableSeats) {
            return res.status(400).json({
                success: false,
                message: "Not enough seats available",
            });
        }

        const newAvailableSeats = availableSeats - seats_to_book;

        const updateSeatsQuery = `
            UPDATE trains 
            SET available_seats = ? 
            WHERE id = ?
        `;

        db.query(updateSeatsQuery, [newAvailableSeats, train_id], (err, updateResult) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error while booking the seat",
                    error: err.message,
                });
            }

            const seatNumbers = [];

            for (let i = 0; i < seats_to_book; i++) {
                seatNumbers.push(availableSeats - i);
            }

            const bookingQuery = `
                INSERT INTO bookings (user_id, train_id, seat_number) 
                VALUES ?
            `;

            const bookingValues = seatNumbers.map(seat_number => [user_id, train_id, seat_number]);

            db.query(bookingQuery, [bookingValues], (err, bookingResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error occurred while saving the booking",
                        error: err.message,
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Seats booked successfully",
                    bookedSeats: seats_to_book,
                    availableSeats: newAvailableSeats,
                    trainDetails: {
                        train_number,
                        departure_time,
                        source,
                        destination
                    }
                });
            });
        });
    });
};





