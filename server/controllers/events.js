const db = require('../config/db');

const getEvents = (req, res) => {
    db.all(`SELECT * FROM events`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

const getEventById = (req, res) => {
    db.get(`SELECT * FROM events WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!row) return res.status(404).json({ message: 'Event not found' });
        res.json(row);
    });
};

const createEvent = (req, res) => {
    const { title, description, category, date, venue, price, total_seats, image_url } = req.body;
    const query = `INSERT INTO events (title, description, category, date, venue, price, total_seats, available_seats, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [title, description, category, date, venue, price, total_seats, total_seats, image_url], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, message: 'Event created' });
    });
};

const updateEvent = (req, res) => {
    const { title, description, category, date, venue, price, total_seats, image_url } = req.body;
    const query = `UPDATE events SET title=?, description=?, category=?, date=?, venue=?, price=?, total_seats=?, image_url=? WHERE id=?`;

    db.run(query, [title, description, category, date, venue, price, total_seats, image_url, req.params.id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Event updated' });
    });
};

const deleteEvent = (req, res) => {
    db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Event deleted' });
    });
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
