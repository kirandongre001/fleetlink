const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const calculateRideDuration = require("../utils/rideDuration");

exports.addVehicle = async (req, res) => {
  try {
     const { name, capacityKg, tyres } = req.body;

    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields required" });
    }

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    console.log(vehicle)
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Ride duration calculation
// const calculateRideDuration = (fromPincode, toPincode) => {
//   return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
// };

exports.getAvailableVehicles = async (req, res) => {
  try {
    console.log("hi");
    
    let { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // Convert types
    capacityRequired = Number(capacityRequired);
    const start = new Date(startTime);

    const rideDuration = calculateRideDuration(fromPincode, toPincode);
    const end = new Date(start.getTime() + rideDuration * 60 * 60 * 1000);

    // Find vehicles that meet capacity
    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });
     console.log(vehicles)
    const available = [];

    for (const v of vehicles) {
      const conflict = await Booking.findOne({
        vehicleId: v._id,
        startTime: { $lt: end },
        endTime: { $gt: start },
      });

      if (!conflict) {
        available.push({
          ...v._doc,
          estimatedRideDurationHours: rideDuration,
        });
      }
    }

    res.status(200).json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

