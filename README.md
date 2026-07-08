# HotelMS Frontend

Hotel Management System frontend built with **Vite + React**.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Build for Production

```bash
npm run build
```

## Configuration

Copy `.env.example` to `.env` and update the API URL:

```
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx       # User bookings
│   ├── AdminDashboard.jsx  # Admin panel
│   ├── BookingPage.jsx     # Browse hotels & rooms
│   ├── Booking.jsx         # Multi-step booking form
│   ├── AboutUs.jsx
│   └── ContactUs.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Features

- User registration and login (JWT auth)
- Browse hotels by city
- Multi-step booking: dates → guest info → payment
- User dashboard: view and cancel bookings
- Admin dashboard: manage cities, hotels, rooms, view all bookings
- Responsive, clean UI

## Backend

Requires the Spring Boot backend running on `http://localhost:8080`.

Demo credentials: `admin@hotel.com` / `admin123`
