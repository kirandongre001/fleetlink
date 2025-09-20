# fleetlink
FleetLink - Logistics Vehicle Booking System
# FleetLink - Logistics Vehicle Booking System

FleetLink is a full-stack logistics vehicle booking platform for B2B clients. The platform allows administrators and users to manage a fleet of vehicles, check availability based on capacity, route, and time, and handle bookings in a reliable and accurate way.

---

## 📘 Project Overview

**Scenario:**  
FleetLink manages and books logistics vehicles efficiently, providing a web-based interface for adding vehicles, searching availability, and initiating bookings. Reliability and accurate availability checking are the main priorities.

**Tech Stack:**  
- **Frontend:** React.js  
- **Backend:** Node.js (Express.js)  
- **Database:** MongoDB  
- **Testing:** Jest (backend unit tests)

---

## 🎯 Features

### Backend
- **POST /api/vehicles**: Add a new vehicle with `name`, `capacityKg`, and `tyres`.
- **GET /api/vehicles/available**: Search available vehicles based on `capacityRequired`, `fromPincode`, `toPincode`, and `startTime`.
- **POST /api/bookings**: Book a vehicle while checking for conflicts and ensuring availability.
- Robust logic for availability checks and overlap handling.
- Accurate calculation of **estimated ride duration** (simplified placeholder logic).

### Frontend
- **Add Vehicle Page**: Form to add new vehicles with success/error messages.
- **Search & Book Page**:
  - Search vehicles by capacity, route, and start time.
  - Display available vehicles with estimated ride duration.
  - "Book Now" button to initiate booking and show confirmation/error messages.
- Uses **Fetch API / Axios** for backend communication.
- Basic UI with clear feedback (loading, success, error states).

---

## 🔧 Installation

### Prerequisites
- Node.js >= 14
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
