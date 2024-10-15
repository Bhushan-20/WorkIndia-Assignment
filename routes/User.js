const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/Auth");
const { addTrain } = require("../controllers/AddTrain");
const {getTrains,bookSeat} = require("../controllers/User")
const { auth , isAdmin} = require("../middleware/authorization")

// Function to create routes with database connection
const createRoutes = (db) => {
    router.post("/register", register(db));
    router.post("/login", login(db));
    router.post("/add-train",auth,isAdmin,addTrain(db));
    router.post("/trains",auth,getTrains(db));
    router.post("/book-seat",auth,bookSeat(db));
    return router;
};

module.exports = createRoutes;
