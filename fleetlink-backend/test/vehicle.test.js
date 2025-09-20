const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Vehicle = require("../src/models/Vehicle");

beforeAll(() => mongoose.connect("mongodb://localhost:27017/fleetlink_test"));
afterAll(() => mongoose.connection.close());

describe("POST /api/vehicles", () => {
  it("should create a vehicle", async () => {
    const res = await request(app).post("/api/vehicles").send({ name: "Truck1", capacityKg: 1000, tyres: 6 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Truck1");
  });
});
