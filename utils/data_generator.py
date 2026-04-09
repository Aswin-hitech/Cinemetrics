import json
import os
import random
from utils.file_handler import write_json

movies_data = [
    {"id": 1, "name": "Leo", "genre": "Action", "poster": "https://m.media-amazon.com/images/M/MV5BMGRlYTFlYmEtYTk1Ny00ZDRhLWE2ZTMtYzk4Zjg0Nzk1ZDE0XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [4, 5, 3, 5, 4, 5], "tickets": {"morning": 20, "afternoon": 45, "evening": 80, "night": 60}},
    {"id": 2, "name": "Jailer", "genre": "Action", "poster": "https://m.media-amazon.com/images/M/MV5BNmU1OTgzYzAtYTcxZC00MmI5LWIyOTAtY2VlYWQyYWVjZGRiXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 4, 5, 5, 4], "tickets": {"morning": 15, "afternoon": 30, "evening": 90, "night": 70}},
    {"id": 3, "name": "Kantara", "genre": "Drama", "poster": "https://m.media-amazon.com/images/M/MV5BOTE2OTYxN2MtYjY2Yy00ZjUxLTkxN2UtYTNhMDY0Y2QwYmE2XkEyXkFqcGc@._V1_QL75_UX380_CR0,41,380,561_.jpg", "ratings": [5, 5, 4, 5, 5], "tickets": {"morning": 10, "afternoon": 25, "evening": 40, "night": 30}},
    {"id": 4, "name": "Interstellar", "genre": "Sci-Fi", "poster": "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LWIxZDYtOWIwZjFjZGZlZGQyXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 5, 5, 4, 5], "tickets": {"morning": 5, "afternoon": 15, "evening": 50, "night": 40}},
    {"id": 5, "name": "Endgame", "genre": "Superhero", "poster": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 5, 5, 5, 4, 5], "tickets": {"morning": 30, "afternoon": 60, "evening": 120, "night": 100}},
    {"id": 6, "name": "Inception", "genre": "Sci-Fi", "poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 4, 5, 5, 5], "tickets": {"morning": 10, "afternoon": 20, "evening": 60, "night": 50}},
    {"id": 7, "name": "The Dark Knight", "genre": "Action", "poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 5, 5, 5, 5], "tickets": {"morning": 25, "afternoon": 50, "evening": 110, "night": 90}},
    {"id": 8, "name": "Parasite", "genre": "Thriller", "poster": "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg", "ratings": [5, 5, 4, 5, 5, 4], "tickets": {"morning": 5, "afternoon": 10, "evening": 40, "night": 30}}
]

users_data = [
    {"user_id": i, "name": f"User_{i}", "ratings_given": [], "bookings": []} for i in range(1, 21)
]

def generate():
    write_json("movies.json", movies_data)
    write_json("users.json", users_data)
    print("Data generated successfully.")

if __name__ == "__main__":
    generate()
