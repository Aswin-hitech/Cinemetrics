/**
 * CineMetrics Advanced Analytics Dashboard
 * 
 * Handles data fetching, KPI updates, and Chart.js initialization
 * with strict responsiveness and accessibility settings.
 */

// Global state for charts to prevent memory leaks and ghosting
const charts = {};

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    // Resize listener to ensure charts adjust correctly
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart.resize());
    });
});

/**
 * Main initialization function
 */
async function initDashboard() {
    try {
        const response = await fetch('/analytics/overview');
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        
        const data = await response.json();
        
        updateKPIs(data.kpis);
        renderCharts(data.charts);
        renderInsights(data.insights);
    } catch (err) {
        console.error('Dashboard Init Error:', err);
        showToast('Error loading dashboard data', 'error');
    }
}

/**
 * Updates the KPI cards with formatted values
 */
function updateKPIs(kpis) {
    document.getElementById('totalMovies').innerText = kpis.total_movies.toLocaleString();
    document.getElementById('totalRatings').innerText = kpis.total_ratings.toLocaleString();
    document.getElementById('totalTickets').innerText = kpis.total_tickets.toLocaleString();
    document.getElementById('peakHour').innerText = kpis.peak_hour;
}

/**
 * Shared Chart.js Defaults
 */
const getBaseConfig = (type) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 800,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: { family: "'Inter', sans-serif", size: 12 },
                color: '#4b5563'
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: { family: "'Inter', sans-serif", weight: 'bold' },
            bodyFont: { family: "'Inter', sans-serif" },
            padding: 12,
            cornerRadius: 8,
            displayColors: true
        }
    },
    layout: {
        padding: 15
    }
});

const getAxisStyles = () => ({
    grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
    ticks: {
        color: '#6b7280',
        font: { family: "'Inter', sans-serif", size: 11 },
        padding: 8
    }
});

/**
 * Renders all dashboard charts
 */
function renderCharts(chartData) {
    // 1. Ticket Trends (Line)
    renderChart('trendsChart', {
        type: 'line',
        data: {
            labels: chartData.ticket_trends.labels,
            datasets: [{
                label: 'Current Bookings',
                data: chartData.ticket_trends.data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...getBaseConfig(),
            scales: {
                y: { ...getAxisStyles(), beginAtZero: true },
                x: getAxisStyles()
            }
        }
    });

    // 2. Audience Sentiment (Doughnut)
    renderChart('sentimentChart', {
        type: 'doughnut',
        data: {
            labels: chartData.sentiment.labels,
            datasets: [{
                data: chartData.sentiment.data,
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            ...getBaseConfig(),
            cutout: '70%'
        }
    });

    // 3. Ratings Distribution (Bar)
    renderChart('ratingsChart', {
        type: 'bar',
        data: {
            labels: chartData.avg_ratings.labels,
            datasets: [{
                label: 'Rating Score',
                data: chartData.avg_ratings.data,
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 6,
                maxBarThickness: 40
            }]
        },
        options: {
            ...getBaseConfig(),
            indexAxis: 'y',
            scales: {
                x: { ...getAxisStyles(), beginAtZero: true, max: 5 },
                y: getAxisStyles()
            }
        }
    });

    // 4. Sales Forecast (Line with dashed style)
    renderChart('forecastChart', {
        type: 'line',
        data: {
            labels: chartData.forecast.labels,
            datasets: [{
                label: 'Projected Revenue',
                data: chartData.forecast.data,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                borderDash: [5, 5],
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            ...getBaseConfig(),
            scales: {
                y: { ...getAxisStyles(), beginAtZero: true },
                x: getAxisStyles()
            }
        }
    });

    // 5. Genre Popularity (Pie)
    renderChart('genreChart', {
        type: 'pie',
        data: {
            labels: chartData.genres.labels,
            datasets: [{
                data: chartData.genres.data,
                backgroundColor: [
                    '#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff', '#1e1b4b'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: getBaseConfig()
    });

    // 6. Competitive Intensity (Radar)
    renderChart('radarChart', {
        type: 'radar',
        data: {
            labels: chartData.radar.labels,
            datasets: [
                {
                    label: 'Flagship Title',
                    data: chartData.radar.movie1,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    pointBackgroundColor: '#4f46e5'
                },
                {
                    label: 'Competitor A',
                    data: chartData.radar.movie2,
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    pointBackgroundColor: '#94a3b8'
                }
            ]
        },
        options: {
            ...getBaseConfig(),
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    pointLabels: {
                        color: '#6b7280',
                        font: { family: "'Inter', sans-serif", size: 10 }
                    },
                    ticks: { display: false }
                }
            }
        }
    });
}

/**
 * Helper to render or update a chart safely
 */
function renderChart(id, config) {
    const ctx = document.getElementById(id);
    if (!ctx) return;

    // Destroy existing chart to prevent memory leaks and artifacts
    if (charts[id]) {
        charts[id].destroy();
    }

    charts[id] = new Chart(ctx, config);
}

/**
 * Renders AI Insights panel
 */
function renderInsights(insights) {
    const container = document.getElementById('insightsPanel');
    if (!container) return;

    container.innerHTML = insights.map((text, index) => `
        <div class="insight-item animate-in" style="animation-delay: ${0.3 + (index * 0.1)}s">
            <p>${text}</p>
        </div>
    `).join('');
}

/**
 * Utility: Toast Notifications
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; padding: 12px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; border-radius: 8px; font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999; animation: fadeInUp 0.3s ease-out;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}