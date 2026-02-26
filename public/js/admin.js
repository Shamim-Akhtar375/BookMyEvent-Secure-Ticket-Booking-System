document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') return window.location.href = 'login.html';

    loadEvents();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    document.getElementById('add-event-btn').addEventListener('click', () => {
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';
        document.getElementById('event-modal-title').innerText = 'Add New Event';
        document.getElementById('event-modal').style.display = 'flex';
    });

    document.getElementById('close-event-modal').addEventListener('click', () => {
        document.getElementById('event-modal').style.display = 'none';
    });

    document.getElementById('event-form').addEventListener('submit', handleEventSubmit);
});

async function loadEvents() {
    const tableBody = document.getElementById('admin-event-table');
    try {
        const res = await fetch('/api/events');
        const events = await res.json();

        tableBody.innerHTML = events.map(e => `
            <tr>
                <td>${e.title}</td>
                <td>${e.category}</td>
                <td>${new Date(e.date).toLocaleDateString()}</td>
                <td>$${e.price}</td>
                <td>${e.available_seats}/${e.total_seats}</td>
                <td>
                    <button class="btn btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="editEvent(${e.id})">Edit</button>
                    <button class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: #ef4444;" onclick="deleteEvent(${e.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        alert('Failed to load events');
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('event-id').value;
    const eventData = {
        title: document.getElementById('event-title').value,
        category: document.getElementById('event-category').value,
        price: document.getElementById('event-price').value,
        date: document.getElementById('event-date').value,
        total_seats: document.getElementById('event-seats').value,
        venue: document.getElementById('event-venue').value,
        image_url: document.getElementById('event-image').value,
        description: document.getElementById('event-desc').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/events/${id}` : '/api/events';

    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(eventData)
        });

        if (res.ok) {
            alert(id ? 'Event updated' : 'Event created');
            document.getElementById('event-modal').style.display = 'none';
            loadEvents();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (err) {
        alert('Save failed');
    }
}

async function editEvent(id) {
    const res = await fetch(`/api/events/${id}`);
    const e = await res.json();

    document.getElementById('event-id').value = e.id;
    document.getElementById('event-title').value = e.title;
    document.getElementById('event-category').value = e.category;
    document.getElementById('event-price').value = e.price;
    document.getElementById('event-date').value = e.date;
    document.getElementById('event-seats').value = e.total_seats;
    document.getElementById('event-venue').value = e.venue;
    document.getElementById('event-image').value = e.image_url;
    document.getElementById('event-desc').value = e.description;

    document.getElementById('event-modal-title').innerText = 'Edit Event';
    document.getElementById('event-modal').style.display = 'flex';
}

async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;

    try {
        const res = await fetch(`/api/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            alert('Event deleted');
            loadEvents();
        }
    } catch (err) {
        alert('Delete failed');
    }
}
