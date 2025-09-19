const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;
let Vehicles;
let Bookings;

async function init() {
  db = await connectDB();
  Vehicles = db.collection('vehicles');
  Bookings = db.collection('bookings');
}

init();

// Utility: Calculate estimated ride duration hours
function calculateRideDurationHours(fromPincode, toPincode) {
  // Simplified placeholder logic as per spec
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

// Helper: Check if two time intervals overlap
function isOverlap(start1, end1, start2, end2) {
  return (start1 < end2) && (start2 < end1);
}

// POST /api/vehicles - Add new vehicle
app.post('/api/vehicles', async (req, res) => {
  const { name, capacityKg, tyres } = req.body;

  // Validation
  if (
    typeof name !== 'string' ||
    typeof capacityKg !== 'number' ||
    typeof tyres !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid input types' });
  }
  if (!name || capacityKg <= 0 || tyres <= 0) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const vehicle = { name, capacityKg, tyres };
    const result = await Vehicles.insertOne(vehicle);
    res.status(201).json({ _id: result.insertedId, ...vehicle });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// GET /api/vehicles/available - Find available vehicles
app.get('/api/vehicles/available', async (req, res) => {
  try {
    const capacityRequired = parseInt(req.query.capacityRequired);
    const fromPincode = req.query.fromPincode;
    const toPincode = req.query.toPincode;
    const startTimeStr = req.query.startTime;

    if (
      isNaN(capacityRequired) ||
      !fromPincode ||
      !toPincode ||
      !startTimeStr
    ) {
      return res.status(400).json({ error: 'Missing or invalid query params' });
    }

    const startTime = new Date(startTimeStr);
    if (isNaN(startTime.getTime())) {
      return res.status(400).json({ error: 'Invalid startTime format' });
    }

    const estimatedRideDurationHours = calculateRideDurationHours(
      fromPincode,
      toPincode
    );

    const endTime = new Date(startTime.getTime() + estimatedRideDurationHours * 3600 * 1000);

    // Find vehicles with capacity >= capacityRequired
    const vehicles = await Vehicles.find({ capacityKg: { $gte: capacityRequired } }).toArray();

    // Filter out vehicles with overlapping bookings
    const availableVehicles = [];

    for (const vehicle of vehicles) {
      const overlappingBooking = await Bookings.findOne({
        vehicleId: vehicle._id,
        $or: [
          {
            startTime: { $lt: endTime },
            bookingEndTime: { $gt: startTime }
          }
        ]
      });

      if (!overlappingBooking) {
        availableVehicles.push({
          ...vehicle,
          estimatedRideDurationHours
        });
      }
    }

    res.status(200).json(availableVehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch available vehicles' });
  }
});

// POST /api/bookings - Book a vehicle
app.post('/api/bookings', async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime: startTimeStr, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTimeStr || !customerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const startTime = new Date(startTimeStr);
    if (isNaN(startTime.getTime())) {
      return res.status(400).json({ error: 'Invalid startTime format' });
    }

    const estimatedRideDurationHours = calculateRideDurationHours(fromPincode, toPincode);
    const bookingEndTime = new Date(startTime.getTime() + estimatedRideDurationHours * 3600 * 1000);

    // Check vehicle exists
    const vehicle = await Vehicles.findOne({ _id: new require('mongodb').ObjectId(vehicleId) });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Bookings.findOne({
      vehicleId: vehicle._id,
      $or: [
        {
          startTime: { $lt: bookingEndTime },
          bookingEndTime: { $gt: startTime }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({ error: 'Vehicle already booked for this time slot' });
    }

    // Create booking
    const booking = {
      vehicleId: vehicle._id,
      fromPincode,
      toPincode,
      startTime,
      bookingEndTime,
      customerId
    };

    const result = await Bookings.insertOne(booking);

    res.status(201).json({ _id: result.insertedId, ...booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

module.exports = app;
