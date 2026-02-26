let selectedSeats = [];
let currentEvent = null;

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    checkAuth();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navAuth = document.getElementById('nav-auth-links');

    if (user && navAuth) {
        navAuth.innerHTML = `
            <a href="dashboard.html" class="btn btn-outline" style="margin-right: 10px;">Dashboard</a>
            <button id="logout-btn" class="btn btn-primary">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        });
    }
}

async function loadEvents() {
    const list = document.getElementById('event-list');
    const displayEvents = (events) => {
        list.innerHTML = events.map(event => `
            <div class="event-card">
                <img src="${event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}" class="event-img" alt="${event.title}">
                <div class="event-content">
                    <span class="event-category">${event.category}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-info">
                        <span>$${event.price}</span>
                        <span>${event.available_seats} / ${event.total_seats} seats</span>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="openBooking('${event.id}')">Book Now</button>
                </div>
            </div>
        `).join('');
    };

    try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('API unavailable');
        const events = await res.json();
        displayEvents(events);
    } catch (err) {
        // Fallback static data for GitHub Pages Preview
        const staticEvents = [
            { id: 1, title: 'Inception 15th Anniversary', category: 'Movie', price: 15, available_seats: 100, total_seats: 100, image_url: 'assets/movie.png' },
            { id: 2, title: 'Midnight Express - City to Coast', category: 'Bus', price: 25, available_seats: 38, total_seats: 40, image_url: 'assets/bus.png' },
            { id: 3, title: 'Bullet Train: Northbound', category: 'Train', price: 45, available_seats: 300, total_seats: 300, image_url: 'assets/train.png' },
            { id: 4, title: 'Starlight Symphony', category: 'Concert', price: 50, available_seats: 200, total_seats: 200, image_url: 'assets/concert.png' }
        ];
        displayEvents(staticEvents);
    }
}

async function openBooking(id) {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const res = await fetch(`/api/events/${id}`);
    currentEvent = await res.json();

    document.getElementById('modal-title').innerText = `Booking: ${currentEvent.title}`;
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';
    selectedSeats = [];
    updateSummary();

    // Generate seats
    for (let i = 1; i <= currentEvent.total_seats; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        if (i > currentEvent.available_seats + 10) seat.classList.add('occupied'); // Mocking some occupied seats

        seat.addEventListener('click', () => {
            if (seat.classList.contains('occupied')) return;
            seat.classList.toggle('selected');
            const seatNum = i;
            if (selectedSeats.includes(seatNum)) {
                selectedSeats = selectedSeats.filter(s => s !== seatNum);
            } else {
                selectedSeats.push(seatNum);
            }
            updateSummary();
        });
        grid.appendChild(seat);
    }

    document.getElementById('booking-modal').style.display = 'flex';
}

function updateSummary() {
    document.getElementById('selected-seats-count').innerText = selectedSeats.length;
    document.getElementById('total-price').innerText = selectedSeats.length * (currentEvent ? currentEvent.price : 0);
}

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('booking-modal').style.display = 'none';
});

document.getElementById('confirm-booking').addEventListener('click', async () => {
    if (selectedSeats.length === 0) return alert('Select at least one seat');

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                event_id: currentEvent.id,
                seats: JSON.stringify(selectedSeats),
                total_price: selectedSeats.length * currentEvent.price
            })
        });

        if (res.ok) {
            alert('Booking Successful!');
            window.location.href = 'dashboard.html';
        } else {
            const data = await res.json();
            alert(data.message || 'Booking failed');
        }
    } catch (err) {
        alert('Booking failed');
    }
});
