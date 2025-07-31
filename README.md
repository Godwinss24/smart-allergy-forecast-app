# Pollen Forecast and Allergy Alert System 🌿

This project provides daily pollen forecasts and automatically alerts sensitive users when pollen levels are high based on their preferences and location.

---

## 📁 Project Structure
This structure will be broken down into microservices in future iterations.

---

## ✅ Core Features Implemented

### 1. **User Preferences**
- Users can set their location (latitude, longitude).
- Users define sensitivities to allergens: **tree**, **grass**, and **weed**.

### 2. **Forecast Fetching**
- A cron job runs **every minute** to:
  - Fetch preferences from all users.
  - Call external weather APIs using the user’s location.
  - Estimate pollen levels for **tree**, **grass**, and **weed**.
  - Store pollen forecast in the database.

### 3. **Pollen Level Estimation**
- Based on:
  - Average temperature
  - Wind speed
  - Rain accumulation
  - Humidity
  - UV index
- Levels are categorized as:
  - `LOW`
  - `MODERATE`
  - `HIGH`

### 4. **Default Alert Messages**
Each pollen type has preset messages:
```ts
{
  tree: {
    HIGH: "High tree pollen in your area. Please take precautions.",
    MODERATE: "Moderate tree pollen detected today.",
    LOW: "Low tree pollen today. Enjoy your day!"
  },
  grass: { ... },
  weed: { ... }
}
