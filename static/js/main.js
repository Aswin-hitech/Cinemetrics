// Constants and State
const API_BASE = '';
let movies = [];
let charts = {};

// 🚀 Initialization
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index')) {
        loadMovies();
    } else if (path.includes('dashboard')) {
        initDashboard();
    }
    
    // Global Click Listeners for Micro-interactions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
            createRipple(e);
        }
    });
});

// 🎬 Movie Grid Functions
async function loadMovies() {
    try {
        const response = await fetch(`${API_BASE}/get_movies`);
        movies = await response.json();
        renderMovieGrid(movies);
    } catch (err) {
        showToast('Failed to load movies', 'error');
    }
}

function renderMovieGrid(movieList) {
    const grid = document.getElementById('movieGrid');
    if (!grid) return;
    
    grid.innerHTML = movieList.map(movie => `
        <div class="movie-card glass-card animate-in" onclick="openBookingModal(${movie.id})">
            <img src="${movie.poster}" alt="${movie.name}" class="movie-poster">
            <div class="movie-info">
                <span class="rating-badge">★ ${calculateAvgRating(movie.ratings)}</span>
                <h3 style="margin: 0.5rem 0;">${movie.name}</h3>
                <p style="font-size: 0.8rem; color: var(--text-dim);">${movie.genre}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary" style="width: 100%;">Book Tickets</button>
                </div>
            </div>
        </div>
    `).join('');
}

function calculateAvgRating(ratings) {
    if (!ratings || ratings.length === 0) return 'N/A';
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
}

// 🎟️ Booking Logic
function openBookingModal(movieId) {
    const movie = movies.find(m => m.id === movieId);
    const modal = document.getElementById('bookingModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 style="color: var(--accent-glow)">${movie.name}</h2>
        <p style="color: var(--text-dim); margin-bottom: 1.5rem;">Select your preferred showtime and seats</p>
        
        <div style="display: flex; gap: 10px; margin-bottom: 1.5rem;">
            ${['Morning', 'Afternoon', 'Evening', 'Night'].map(time => `
                <button class="btn glass-card time-slot-btn" onclick="selectTimeSlot(this, '${time.toLowerCase()}')">${time}</button>
            `).join('')}
        </div>
        
        <div class="seat-grid">
            ${Array(32).fill(0).map((_, i) => `<div class="seat" onclick="toggleSeat(this)"></div>`).join('')}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
            <div>
                <p style="font-size: 0.8rem; color: var(--text-dim);">Selected: <span id="seatCount" style="color: white">0</span> seats</p>
                <p style="font-weight: bold; font-size: 1.2rem;">Total: $<span id="totalPrice">0</span></p>
            </div>
            <button class="btn btn-primary" onclick="confirmBooking(${movie.id})">Confirm Booking</button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

let selectedTime = null;
function selectTimeSlot(btn, time) {
    document.querySelectorAll('.time-slot-btn').forEach(b => b.style.borderColor = 'var(--glass-border)');
    btn.style.borderColor = 'var(--accent-glow)';
    selectedTime = time;
}

function toggleSeat(seat) {
    if (seat.classList.contains('occupied')) return;
    seat.classList.contains('selected') ? seat.classList.remove('selected') : seat.classList.add('selected');
    updateBookingDetails();
}

function updateBookingDetails() {
    const selected = document.querySelectorAll('.seat.selected').length;
    document.getElementById('seatCount').innerText = selected;
    document.getElementById('totalPrice').innerText = selected * 15;
}

async function confirmBooking(movieId) {
    if (!selectedTime) return showToast('Please select a time slot', 'warning');
    const seats = document.querySelectorAll('.seat.selected').length;
    if (seats === 0) return showToast('Please select at least one seat', 'warning');

    try {
        const response = await fetch('/book_ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie_id: movieId, time: selectedTime })
        });
        const res = await response.json();
        showToast('Tickets booked successfully!', 'success');
        closeModal();
    } catch (err) {
        showToast('Booking failed', 'error');
    }
}

// 📊 Dashboard Logic
async function initDashboard() {
    try {
        const response = await fetch('/analytics/overview');
        const data = await response.json();
        
        updateKPIs(data.kpis);
        renderCharts(data.charts);
        renderInsights(data.insights);
    } catch (err) {
        showToast('Failed to load dashboard data', 'error');
    }
}

function updateKPIs(kpis) {
    document.getElementById('totalMovies').innerText = kpis.total_movies;
    document.getElementById('totalRatings').innerText = kpis.total_ratings;
    document.getElementById('totalTickets').innerText = kpis.total_tickets;
    document.getElementById('peakHour').innerText = kpis.peak_hour;
}

function renderCharts(chartData) {
    const config = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#a0a0ff' } } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0ff' } },
            x: { grid: { display: false }, ticks: { color: '#a0a0ff' } }
        }
    };

    // 1. Ratings Bar Chart
    new Chart(document.getElementById('ratingsChart'), {
        type: 'bar',
        data: {
            labels: chartData.avg_ratings.labels,
            datasets: [{
                label: 'Avg Rating',
                data: chartData.avg_ratings.data,
                backgroundColor: 'rgba(124, 77, 255, 0.6)',
                borderColor: '#7c4dff',
                borderWidth: 1
            }]
        },
        options: config
    });

    // 2. Ticket Trends Line Chart
    new Chart(document.getElementById('trendsChart'), {
        type: 'line',
        data: {
            labels: chartData.ticket_trends.labels,
            datasets: [{
                label: 'Bookings',
                data: chartData.ticket_trends.data,
                borderColor: '#00f2fe',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(0, 242, 254, 0.1)'
            }]
        },
        options: config
    });

    // 3. Genre Pie Chart
    new Chart(document.getElementById('genreChart'), {
        type: 'pie',
        data: {
            labels: chartData.genres.labels,
            datasets: [{
                data: chartData.genres.data,
                backgroundColor: ['#7c4dff', '#00f2fe', '#ff4081', '#f4ff81', '#18ffff']
            }]
        },
        options: { ...config, scales: null }
    });

    // 4. Forecast Forecast Line Chart
    new Chart(document.getElementById('forecastChart'), {
        type: 'line',
        data: {
            labels: chartData.forecast.labels,
            datasets: [{
                label: 'Projected Sales',
                data: chartData.forecast.data,
                borderColor: '#f4ff81',
                borderDash: [5, 5],
                tension: 0.3
            }]
        },
        options: config
    });

    // 5. Radar Comparison
    new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
            labels: chartData.radar.labels,
            datasets: [
                { label: 'Top Movie', data: chartData.radar.movie1, borderColor: '#7c4dff' },
                { label: 'New Release', data: chartData.radar.movie2, borderColor: '#00f2fe' }
            ]
        },
        options: { ...config, scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#a0a0ff' } } } }
    });
}

function renderInsights(insights) {
    const container = document.getElementById('insightsPanel');
    container.innerHTML = insights.map(text => `
        <div class="insight-item animate-in">
            <p style="font-size: 0.9rem; line-height: 1.4;">${text}</p>
        </div>
    `).join('');
}

// ✨ Micro-interactions
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `glass-card toast toast-${type}`;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 1rem 2rem;
        z-index: 3000; border-left: 4px solid ${type === 'success' ? '#00f2fe' : '#ff4081'};
        animation: slideIn 0.3s ease;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}