const request = require('supertest');
const app = require('./app');
const { connectDB } = require('./db');
const { ObjectId } = require('mongodb');

let db;
let Vehicles;
let Bookings;

beforeAll(async () => {
  db = await connectDB();
  Vehicles = db.collection('vehicles');
  Bookings = db.collection('bookings');
  await Vehicles.deleteMany({});
  await Bookings.deleteMany({});
});

afterAll(async () => {
  await Vehicles.deleteMany({});
  await Bookings.deleteMany({});
});

describe('POST /api/vehicles', () => {
  it('should add a new vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck A', capacityKg: 1000, tyres: 6 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Truck A');
  });

  it('should reject invalid input', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck B', capacityKg: 'large', tyres: 6 });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/vehicles/available', () => {
  let vehicleId;

  beforeAll(async () => {
    const vehicle = await Vehicles.insertOne({ name: 'Truck B', capacityKg: 500, tyres: 4 });
    vehicleId = vehicle.insertedId;
  });

  it('should return available vehicles', async () => {
    const res = await request(app)
      .get('/api/vehicles/available')
      .query({
        capacityRequired: 400,
        fromPincode: '1000',
        toPincode: '1010',
        startTime: new Date().toISOString()
      });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(v => v._id === vehicleId.toString())).toBe(true);
  });

  it('should exclude vehicles with overlapping bookings', async () => {
    const startTime = new Date();
    const bookingEndTime = new Date(startTime.getTime() + 2 * 3600 * 1000);

    await Bookings.insertOne({
      vehicleId,
      fromPincode: '1000',
      toPincode: '1010',
      startTime,
      bookingEndTime,
      customerId: 'cust1'
    });

    const res = await request(app)
      .get('/api/vehicles/available')
      .query({
        capacityRequired: 400,
        fromPincode: '1000',
        toPincode: '1010',
        startTime: startTime.toISOString()
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.some(v => v._id === vehicleId.toString())).toBe(false);
  });
});

describe('POST /api/bookings', () => {
  let vehicleId;

  beforeAll(async () => {
    const vehicle = await Vehicles.insertOne({ name: 'Truck C', capacityKg: 1000, tyres: 8 });
    vehicleId = vehicle.insertedId;
  });

  it('should create a booking successfully', async () => {
    const startTime = new Date();
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: vehicleId.toString(),
        fromPincode: '2000',
        toPincode: '2010',
        startTime: startTime.toISOString(),
        customerId: 'cust123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should reject booking if vehicle is already booked', async () => {
    const startTime = new Date();
    // Create initial booking
    await Bookings.insertOne({
      vehicleId,
      fromPincode: '2000',
      toPincode: '2010',
      startTime,
      bookingEndTime: new Date(startTime.getTime() + 1 * 3600 * 1000),
      customerId: 'custX'
    });

    // Try to book overlapping time
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: vehicleId.toString(),
        fromPincode: '2000',
        toPincode: '2010',
        startTime: startTime.toISOString(),
        customerId: 'custY'
      });

    expect(res.statusCode).toBe(409);
  });

  it('should return 404 if vehicle does not exist', async () => {
    const startTime = new Date();
    const res = await request(app)
      .post('/api/bookings')
      .send({
        vehicleId: new ObjectId().toString(),
        fromPincode: '2000',
        toPincode: '2010',
        startTime: startTime.toISOString(),
        customerId: 'custZ'
      });
    expect(res.statusCode).toBe(404);
  });
});
