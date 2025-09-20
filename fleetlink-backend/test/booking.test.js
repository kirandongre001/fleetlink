const request = require("supertest");
const app = require("../src/app");
const Vehicle = require("../src/models/Vehicle");
const Booking = require("../src/models/Booking");

describe("POST /api/bookings", () => {
  let vehicle;

  beforeEach(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    vehicle = await Vehicle.create({ name: "Test Truck", capacityKg: 1500, tyres: 6 });
  });

  it("should create a booking when vehicle is available", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: vehicle._id,
      fromPincode: "100100",
      toPincode: "100120",
      startTime: new Date().toISOString(),
      customerId: "cust001"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.vehicleId).toBe(vehicle._id.toString());
  });

  it("should return 409 if booking conflicts", async () => {
    const start = new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await Booking.create({
      vehicleId: vehicle._id,
      fromPincode: "100100",
      toPincode: "100120",
      startTime: start,
      endTime: end,
      customerId: "cust002"
    });

    const res = await request(app).post("/api/bookings").send({
      vehicleId: vehicle._id,
      fromPincode: "100110",
      toPincode: "100130",
      startTime: start.toISOString(),
      customerId: "cust003"
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Vehicle unavailable in this slot");
  });

  it("should return 404 if vehicle does not exist", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: "650f08a3bdb4c8f3d4e12f34", // fake ObjectId
      fromPincode: "100200",
      toPincode: "100300",
      startTime: new Date().toISOString(),
      customerId: "cust004"
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Vehicle not found");
  });
});
