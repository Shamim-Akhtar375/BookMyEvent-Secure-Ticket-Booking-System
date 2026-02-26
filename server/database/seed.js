const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const seed = async () => {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    db.serialize(() => {
        // Ensure tables exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            date TEXT NOT NULL,
            venue TEXT NOT NULL,
            price INTEGER NOT NULL,
            total_seats INTEGER NOT NULL,
            available_seats INTEGER NOT NULL,
            image_url TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            seats TEXT NOT NULL,
            total_price INTEGER NOT NULL,
            status TEXT DEFAULT 'Confirmed',
            booking_date TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (event_id) REFERENCES events (id)
        )`);

        // Insert Admin
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            ['Admin User', 'admin@smartticket.com', adminPassword, 'admin']);

        // Insert Regular User
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            ['John Doe', 'john@example.com', userPassword, 'user']);

        // Insert Sample Events
        const events = [
            ['Inception 15th Anniversary', 'Christopher Nolan\'s masterpiece back on big screen.', 'Movie', '2026-06-15T19:00', 'IMAX Cinema', 15, 100, 100, 'assets/movie.png'],
            ['Midnight Express - City to Coast', 'Luxury night bus with panoramic views.', 'Bus', '2026-07-01T22:00', 'Central Terminal', 25, 40, 40, 'assets/bus.png'],
            ['Bullet Train: Northbound', 'Fastest rail connection between major cities.', 'Train', '2026-05-20T09:00', 'Grand Central', 45, 300, 300, 'assets/train.png'],
            ['Starlight Symphony', 'Classical music under the open sky.', 'Concert', '2026-08-10T20:00', 'Main Park Arena', 50, 200, 200, 'assets/concert.png']
        ];

        const stmt = db.prepare(`INSERT INTO events (title, description, category, date, venue, price, total_seats, available_seats, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        events.forEach(e => stmt.run(e));
        stmt.finalize();

        console.log('Database seeded successfully!');
    });
};

seed();
