const express = require('express');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const con = require('./config/db');

const app = express();

// Check database connection
con.connect(function(err) {
    if (err) {
        console.error('Error connecting to database.');
        return;
    }
    console.log('Connected to database');
});

// set the public folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for session
app.use(session({
    cookie: { maxAge: 86400000 }, // 1 day in milliseconds
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}));

// Get all rooms available for booking
app.get('/user/room', (req, res) => {
    const sql = "SELECT * FROM rooms WHERE status='Free'";
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});

// Get a single room details by ID
app.get('/user/room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const sql = "SELECT * FROM rooms WHERE id = ?";
    con.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (result.length === 0) {
            return res.status(404).send("Room not found");
        }
        res.json(result[0]);
    });
});

// Route to handle room booking
app.post('/user/room/book/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const sql = "UPDATE rooms SET status = 'Reserved' WHERE id = ? AND status = 'Free'";
    con.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (result.affectedRows === 0) {
            return res.status(400).send("Room already booked or not available");
        }
        res.json({ success: true, message: 'Room successfully reserved' });
    });
});

// Home page route
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views/bookingroom.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
