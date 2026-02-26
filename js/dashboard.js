document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return window.location.href = 'login.html';

    document.getElementById('user-info').innerText = `Welcome, ${user.name}`;
    loadBookings();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

async function loadBookings() {
    const list = document.getElementById('bookings-list');
    try {
        const res = await fetch('/api/bookings/user', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const bookings = await res.json();

        if (bookings.length === 0) {
            list.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">You have no bookings yet.</p>';
            return;
        }

        list.innerHTML = bookings.map(b => `
            <div class="event-card" style="border-left: 5px solid ${b.status === 'Confirmed' ? '#10b981' : '#ef4444'}">
                <div class="event-content">
                    <span class="event-category">${b.status}</span>
                    <h3 class="event-title">${b.title}</h3>
                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
                        <p>Date: ${new Date(b.date).toLocaleString()}</p>
                        <p>Venue: ${b.venue}</p>
                        <p>Seats: ${JSON.parse(b.seats).join(', ')}</p>
                        <p>Total: $${b.total_price}</p>
                    </div>
                    ${b.status === 'Confirmed' ? `
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline" style="flex: 1;" onclick="cancelBooking(${b.id})">Cancel</button>
                            <button class="btn btn-primary" style="flex: 1;" onclick="printTicket(${b.id})">Print</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = '<p>Failed to load bookings.</p>';
    }
}

async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const res = await fetch(`/api/bookings/cancel/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            alert('Booking cancelled');
            loadBookings();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        alert('Action failed');
    }
}

function printTicket(id) {
    window.print();
}
