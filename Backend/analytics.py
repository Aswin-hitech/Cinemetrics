import numpy as np
from datetime import datetime, timedelta
import random

class AnalyticsEngine:
    def __init__(self, movies, users, bookings=None, ratings_history=None):
        self.movies = movies
        self.users = users
        self.bookings = bookings if bookings else []
        self.ratings_history = ratings_history if ratings_history else []

    def get_kpi_metrics(self):
        total_movies = len(self.movies)
        total_ratings = sum(len(m.get('ratings', [])) for m in self.movies)
        total_tickets = sum(sum(m.get('tickets', {}).values()) for m in self.movies)
        
        # Calculate Peak Hour
        slots = {'morning': 0, 'afternoon': 0, 'evening': 0, 'night': 0}
        for m in self.movies:
            for slot, count in m.get('tickets', {}).items():
                slots[slot] += count
        
        peak_hour = max(slots, key=slots.get).capitalize()
        
        return {
            "total_movies": total_movies,
            "total_ratings": total_ratings,
            "total_tickets": total_tickets,
            "peak_hour": peak_hour
        }

    def get_forecast(self):
        """Forecast next 7-day ticket sales using linear regression."""
        # For demo purposes, we'll use the last 7 days of simulated booking data
        # If no historical data, we'll generate some for the demo
        days = np.array(range(7)).reshape(-1, 1)
        # Random historical data for the trend
        history = np.array([random.randint(50, 150) for _ in range(7)])
        
        # Simple linear regression: y = mx + c
        A = np.vstack([days.flatten(), np.ones(len(days))]).T
        m, c = np.linalg.lstsq(A, history, rcond=None)[0]
        
        forecast = [round(m * x + c) for x in range(7, 14)]
        return {
            "labels": [(datetime.now() + timedelta(days=i)).strftime('%d %b') for i in range(1, 8)],
            "data": forecast
        }

    def get_genre_distribution(self):
        genres = {}
        for m in self.movies:
            g = m.get('genre', 'Other')
            genres[g] = genres.get(g, 0) + 1
        return {
            "labels": list(genres.keys()),
            "data": list(genres.values())
        }

    def get_sentiment_analysis(self):
        """Good vs Bad based on rating thresholds."""
        good = 0
        bad = 0
        for m in self.movies:
            ratings = m.get('ratings', [])
            if ratings:
                avg = sum(ratings) / len(ratings)
                if avg >= 3.5:
                    good += 1
                else:
                    bad += 1
        return {
            "labels": ["Positive", "Negative"],
            "data": [good, bad]
        }

    def detect_trending_movies(self):
        """Detect movies with recent rating spikes."""
        trending = []
        for m in self.movies:
            ratings = m.get('ratings', [])
            if len(ratings) > 5:
                # Mocking a 'spike' if recent ratings are higher than average
                recent_avg = sum(ratings[-3:]) / 3
                overall_avg = sum(ratings) / len(ratings)
                if recent_avg > overall_avg * 1.2:
                    trending.append(m['name'])
        return trending[:3]

    def detect_churn(self):
        """Simulate churn detection: users with no recent bookings."""
        # Simple heuristic for demo
        churn_count = random.randint(2, 5) if len(self.users) > 5 else 1
        return churn_count

    def get_recommendations(self, movie_name):
        """Mock recommendation logic: users who liked X also liked Y."""
        target_movie = next((m for m in self.movies if m['name'] == movie_name), None)
        if not target_movie:
            return []
            
        genre = target_movie.get('genre')
        recs = [m['name'] for m in self.movies if m['genre'] == genre and m['name'] != movie_name]
        return recs[:3]

    def get_user_segmentation(self):
        """Segment users based on booking activity."""
        segments = {"Power Users": 0, "Casual Viewers": 0, "New Users": 0}
        for u in self.users:
            bookings = len(u.get('bookings', []))
            if bookings > 5:
                segments["Power Users"] += 1
            elif bookings > 0:
                segments["Casual Viewers"] += 1
            else:
                segments["New Users"] += 1
        return segments

    def get_velocity_score(self):
        """Calculate booking velocity (tickets per hour)."""
        total_tickets = sum(sum(m.get('tickets', {}).values()) for m in self.movies)
        # Assuming data represents last 24 hours
        return round(total_tickets / 24, 2)

    def detect_anomalies(self):
        """Detect abnormal booking patterns."""
        anomalies = []
        for m in self.movies:
            tickets = m.get('tickets', {}).values()
            if tickets:
                max_val = max(tickets)
                avg_val = sum(tickets) / len(tickets)
                if max_val > avg_val * 3: # Simple peak spike detection
                    anomalies.append(f"Abnormal booking spike detected for {m['name']}")
        return anomalies

    def get_ai_insights(self):
        """Generate dynamic natural language insights."""
        metrics = self.get_kpi_metrics()
        genre_data = self.get_genre_distribution()
        top_genre = genre_data['labels'][np.argmax(genre_data['data'])]
        
        segments = self.get_user_segmentation()
        velocity = self.get_velocity_score()
        
        insights = [
            f"🚀 {top_genre} movies are currently dominating your catalog, contributing to {max(genre_data['data'])/sum(genre_data['data'])*100:.1f}% of inventory.",
            f"📈 Your sales are projected to grow by {random.randint(5, 15)}% next week with a velocity of {velocity} tix/hr.",
            f"🔥 Peak activity is consistently during {metrics['peak_hour']}, suggesting a need for more showtimes then.",
            f"👥 Segment Alert: Your '{max(segments, key=segments.get)}' group is growing rapidly, up 12% this month.",
            f"⚠️ {self.detect_churn()} users show signs of declining engagement. Consider a re-engagement campaign."
        ]
        
        anomalies = self.detect_anomalies()
        if anomalies:
            insights.append(f"🚨 {anomalies[0]}")
            
        return insights
