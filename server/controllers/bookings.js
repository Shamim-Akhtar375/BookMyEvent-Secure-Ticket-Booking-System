const db = require('../config/db');

const createBooking = (req, res) => {
    const { event_id, seats, total_price } = req.body;
    const user_id = req.user.id;
    const booking_date = new Date().toISOString();

    db.run(`BEGIN TRANSACTION`);

    // Check availability (simplified - in real app we'd check specific seat IDs)
    db.get(`SELECT available_seats FROM events WHERE id = ?`, [event_id], (err, event) => {
        if (err || !event) {
            db.run(`ROLLBACK`);
            return res.status(404).json({ message: 'Event not found' });
        }

        const seatList = JSON.parse(seats);
        if (event.available_seats < seatList.length) {
            db.run(`ROLLBACK`);
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const query = `INSERT INTO bookings (user_id, event_id, seats, total_price, booking_date) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [user_id, event_id, seats, total_price, booking_date], function (err) {
            if (err) {
                db.run(`ROLLBACK`);
                return res.status(500).json({ message: err.message });
            }

            db.run(`UPDATE events SET available_seats = available_seats - ? WHERE id = ?`, [seatList.length, event_id], (err) => {
                if (err) {
                    db.run(`ROLLBACK`);
                    return res.status(500).json({ message: err.message });
                }

                db.run(`COMMIT`);
                res.status(201).json({ id: this.lastID, message: 'Booking confirmed' });
            });
        });
    });
};

const getUserBookings = (req, res) => {
    const query = `
        SELECT bookings.*, events.title, events.date, events.venue 
        FROM bookings 
        JOIN events ON bookings.event_id = events.id 
        WHERE bookings.user_id = ?
        ORDER BY bookings.id DESC
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
};

const cancelBooking = (req, res) => {
    const booking_id = req.params.id;

    db.get(`SELECT * FROM bookings WHERE id = ? AND user_id = ?`, [booking_id, req.user.id], (err, booking) => {
        if (err || !booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Already cancelled' });

        db.run(`BEGIN TRANSACTION`);

        db.run(`UPDATE bookings SET status = 'Cancelled' WHERE id = ?`, [booking_id], (err) => {
            if (err) {
                db.run(`ROLLBACK`);
                return res.status(500).json({ message: err.message });
            }

            const seatCount = JSON.parse(booking.seats).length;
            db.run(`UPDATE events SET available_seats = available_seats + ? WHERE id = ?`, [seatCount, booking.event_id], (err) => {
                if (err) {
                    db.run(`ROLLBACK`);
                    return res.status(500).json({ message: err.message });
                }

                db.run(`COMMIT`);
                res.json({ message: 'Booking cancelled' });
            });
        });
    });
};

module.exports = { createBooking, getUserBookings, cancelBooking };
