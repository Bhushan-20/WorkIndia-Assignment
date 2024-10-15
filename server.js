const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const createAuthRoutes = require('./routes/User');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 4000;

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL successfully');
});

app.use('/api/auth', createAuthRoutes(db));

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is running..."
    });
});

app.listen(PORT, () => {
    console.log(`Server connected successfully at port ${PORT}`);
});
