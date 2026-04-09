from flask import Flask, jsonify, request, render_template
from utils.file_handler import read_json, write_json
from Backend.analytics import AnalyticsEngine
import os

app = Flask(__name__)

# 📂 Load data helper
def get_data(filename):
    return read_json(filename)

def save_data(filename, data):
    write_json(filename, data)

# 🏠 Home Page
@app.route("/")
def home():
    return render_template("index.html")

# 📊 Dashboard Page
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# ⭐ Get Movies (for frontend)
@app.route("/get_movies", methods=["GET"])
def get_movies():
    movies = get_data("movies.json")
    return jsonify(movies)

# ⭐ Rate Movie
@app.route("/rate_movie", methods=["POST"])
def rate_movie():
    data = request.json
    movie_id = data.get("movie_id")
    rating = data.get("rating")
    
    if not movie_id or not rating:
        return jsonify({"error": "Missing data"}), 400

    movies = get_data("movies.json")
    for movie in movies:
        if movie["id"] == movie_id:
            if "ratings" not in movie:
                movie["ratings"] = []
            movie["ratings"].append(int(rating))
            break
            
    save_data("movies.json", movies)
    return jsonify({"message": "Rating added successfully", "ratings": next(m["ratings"] for m in movies if m["id"] == movie_id)})

# 🎟️ Book Ticket
@app.route("/book_ticket", methods=["POST"])
def book_ticket():
    data = request.json
    movie_id = data.get("movie_id")
    time = data.get("time") # morning, afternoon, evening, night

    if not movie_id or not time:
        return jsonify({"error": "Missing data"}), 400

    movies = get_data("movies.json")
    for movie in movies:
        if movie["id"] == movie_id:
            if "tickets" not in movie:
                movie["tickets"] = {"morning": 0, "afternoon": 0, "evening": 0, "night": 0}
            movie["tickets"][time] += 1
            break

    save_data("movies.json", movies)
    return jsonify({"message": "Ticket booked successfully"})

# 📊 Advanced Analytics API
@app.route("/analytics/overview", methods=["GET"])
def analytics_overview():
    movies = get_data("movies.json")
    users = get_data("users.json")
    engine = AnalyticsEngine(movies, users)
    
    kpis = engine.get_kpi_metrics()
    forecast = engine.get_forecast()
    genres = engine.get_genre_distribution()
    sentiment = engine.get_sentiment_analysis()
    insights = engine.get_ai_insights()
    
    # Prepare data for all charts
    chart_data = {
        "avg_ratings": {
            "labels": [m["name"] for m in movies],
            "data": [round(sum(m.get("ratings", [0]))/len(m.get("ratings", [1])), 2) for m in movies]
        },
        "ticket_trends": {
            "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "data": [sum(m["tickets"].values()) for m in movies] # Simplified for line chart
        },
        "forecast": forecast,
        "genres": genres,
        "sentiment": sentiment,
        "radar": {
            "labels": ["Ratings", "Bookings", "Popularity", "Engagement", "Velocity"],
            "movie1": [4.5, 80, 70, 90, 60], # Mocked comparison data
            "movie2": [4.0, 60, 85, 75, 80]
        }
    }
    
    return jsonify({
        "kpis": kpis,
        "charts": chart_data,
        "insights": insights
    })

@app.route("/analytics/movie/<int:movie_id>", methods=["GET"])
def movie_drilldown(movie_id):
    movies = get_data("movies.json")
    movie = next((m for m in movies if m["id"] == movie_id), None)
    
    if not movie:
        return jsonify({"error": "Movie not found"}), 404
        
    engine = AnalyticsEngine(movies, [])
    recs = engine.get_recommendations(movie["name"])
    
    return jsonify({
        "movie": movie,
        "recommendations": recs,
        "performance": {
            "labels": ["Morning", "Afternoon", "Evening", "Night"],
            "data": [movie["tickets"].get(s, 0) for s in ["morning", "afternoon", "evening", "night"]]
        }
    })

# ▶️ Run App
if __name__ == "__main__":
    app.run(debug=True, port=5000)