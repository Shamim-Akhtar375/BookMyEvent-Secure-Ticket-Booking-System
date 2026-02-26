# BookMyEvent - Secure Ticket Booking System (SmartTicket)

SmartTicket is a full-stack, production-ready web application for booking tickets for movies, buses, trains, and concerts. It features a modern premium UI with glassmorphism, smooth animations, and a secure backend.

## 🚀 Features

### Frontend
- **Beautiful UI**: Dark gradient theme with glassmorphism cards and hover effects.
- **Interactive Booking**: Interactive seat selection grid.
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
- **Real-time Updates**: Dynamic price calculation and seat availability feedback.
- **User Dashboard**: View booking history and cancel tickets.
- **Admin Panel**: Full CRUD operations for event management.

### Backend
- **RESTful API**: Clean and modular API structure using Express.js.
- **Secure Auth**: JWT authentication with bcrypt password hashing.
- **Robust Database**: SQLite for efficient data storage.
- **Role-based Access**: Separate routes and permissions for users and admins.
- **Transaction Safety**: Atomicity in booking processes to prevent double booking.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+), Fetch API.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (sqlite3).
- **Authentication**: JWT (JSON Web Token).
- **Security**: bcryptjs for password encryption.

---

## 📂 Folder Structure

```text
smartticket/
│
├── server/
│   ├── app.js               # Express application config
│   ├── config/
│   │     └── db.js          # SQLite connection & table creation
│   ├── controllers/         # Request logic (Auth, Events, Bookings)
│   ├── routes/              # API Endpoints
│   ├── middleware/          # Auth & Error handling
│   ├── database/
│   │     └── seed.js        # Seed data script
│   └── database.sqlite      # SQLite database file (generated)
│
├── public/                  # Static frontend files
│   ├── index.html           # Homepage
│   ├── login.html           # Login page
│   ├── register.html        # Register page
│   ├── dashboard.html       # User dashboard
│   ├── admin.html           # Admin panel
│   ├── css/                 # Stylesheets
│   ├── js/                  # Frontend logic
│   └── assets/              # Images and icons
│
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
└── server.js                # Entry point
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shamim-Akhtar375/BookMyEvent-Secure-Ticket-Booking-System
   cd BookMyEvent-Secure-Ticket-Booking-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (or use the one provided):
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_key
   ```

4. **Seed the database** (Optional but recommended for testing)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the App**
   Open `http://localhost:5000` in your browser.

---

## 🔑 Demo Credentials

- **Admin Account**:
  - Email: `admin@smartticket.com`
  - Password: `admin123`
- **User Account**:
  - Email: `john@example.com`
  - Password: `user123`

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event details
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get logged-in user's bookings
- `PUT /api/bookings/cancel/:id` - Cancel a booking

---

## 📝 Future Improvements
- QR Code generation for tickets.
- Stripe/PayPal integration for actual payments.
- Email notifications upon booking.
- Search and multi-category filtering.
