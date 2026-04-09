# 🎬 Movie Analytics Platform

### 📊 A Full-Stack Data Science & Visualization Project

---

## 🚀 Overview

**Movie Analytics Platform** is a full-stack web application that combines **data collection, analysis, and visualization** to simulate a real-world movie rating and ticket booking system.

This project is not just a web app — it is a **data science-driven analytics platform** that transforms raw user interactions into meaningful insights using statistical analysis and visual dashboards.

---

## 🎯 Project Objective

To demonstrate the **complete data science pipeline**:

> **Data Collection → Data Storage → Data Processing → Data Analysis → Data Visualization**

---

## 🧠 Why This is a Data Science Project

This system performs real-time analytics on user-generated data:

* ⭐ Computes **average ratings**
* 📈 Tracks **trends in ticket sales**
* ⏰ Identifies **peak booking hours**
* 📊 Classifies movies into **Good vs Bad**
* 📉 Analyzes **user engagement patterns**

All insights are visualized using interactive charts.

---

## 🛠️ Tech Stack

### 🔹 Frontend

* HTML5
* CSS3 (Glassmorphism / Light UI)
* JavaScript
* Chart.js (Data Visualization)

### 🔹 Backend

* Python Flask
* REST APIs

### 🔹 Data Storage

* JSON (acts as lightweight database)

---

## 📁 Project Structure

```
movie-rating-app/
│
├── app.py
├── data/
│   ├── movies.json
│
├── templates/
│   ├── index.html
│   ├── dashboard.html
│
├── static/
│   ├── css/
│   ├── js/
│   ├── images/
│
├── utils/
│   └── file_handler.py
```

---

## ⚙️ Features

### 🎥 Movie Module

* Display movies with posters
* Interactive ⭐ rating system
* Real-time rating updates

### 🎟️ Ticket Booking

* Book tickets by time slot
* Tracks:

  * Morning
  * Afternoon
  * Evening
  * Night

### 📊 Data Science Analytics Dashboard

#### 📌 Visualizations:

* ⭐ Average Rating (Bar Chart)
* 🎟️ Ticket Sales (Bar Chart)
* ⏰ Peak Hour Analysis (Line Chart)
* 📈 Good vs Bad Movies (Pie Chart)

#### 📌 Insights:

* Most popular movie
* Peak booking time
* Rating distribution

---

## 🔄 Data Flow Architecture

```
User Action (Rate / Book)
        ↓
Flask API
        ↓
JSON Storage
        ↓
Analytics Processing
        ↓
Dashboard Visualization
```

---

## 📊 Example Data

```json
{
  "name": "Leo",
  "ratings": [4, 5, 3],
  "tickets": {
    "morning": 10,
    "afternoon": 20,
    "evening": 35,
    "night": 25
  }
}
```

---

## 🚀 How to Run

### 1️⃣ Install Dependencies

```bash
pip install flask
```

### 2️⃣ Run Application

```bash
python app.py
```

### 3️⃣ Open Browser

```
http://127.0.0.1:5000/
```

Dashboard:

```
http://127.0.0.1:5000/dashboard
```

---

## 📈 Data Science Concepts Used

* Descriptive Analytics
* Aggregation (mean, sum)
* Classification (Good vs Bad)
* Time-based Analysis
* Data Visualization
* Trend Analysis

---

## 💡 Future Enhancements

* 🤖 AI-based movie recommendations
* 📊 Predictive analytics (sales forecasting)
* 🗄️ Database integration (MongoDB/MySQL)
* 🔐 User authentication system
* 📉 Advanced statistical models

---

## 🎓 Use Cases

* Academic Data Science Mini Project
* Full-Stack Development Practice
* Dashboard & Visualization Learning
* Hackathon Project

---

## 🏁 Conclusion

This project demonstrates how **data science and full-stack development can work together** to create intelligent, insight-driven applications.

It showcases:

* Analytical thinking
* Visual storytelling using data

---

## 👨‍💻 Author

**Aswin**
  
  kit28.24bam009@gmail.com
  
  KIT-KalaignarKarunanidhi Institute of Technology, Coimbatore
  
  AI/ML Student

---

## ⭐ If you like this project

Give it a star ⭐ and use it for your portfolio!
