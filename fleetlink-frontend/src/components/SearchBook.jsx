import React, { useState } from 'react';
import axios from 'axios';

const SearchBook = () => {
  const [form, setForm] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [error, setError] = useState(null);

  const customerId = 'customer123'; // Hardcoded for simplicity

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const searchAvailability = async () => {
    setLoading(true);
    setVehicles([]);
    setBookingStatus(null);
    setError(null);

    try {
      const params = {
        capacityRequired: form.capacityRequired,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: form.startTime
      };
      const res = await axios.get('http://localhost:4000/api/vehicles/available', { params });
      setVehicles(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const bookVehicle = async vehicleId => {
    setBookingStatus(null);
    setError(null);
    try {
      const payload = {
        vehicleId,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: form.startTime,
        customerId
      };
      const res = await axios.post('http://localhost:4000/api/bookings', payload);
      setBookingStatus(`Booking successful! Booking ID: ${res.data._id}`);
      // Optionally refresh availability
      searchAvailability();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Vehicle became unavailable for the selected time slot.');
      } else {
        setError(err.response?.data?.error || 'Booking failed');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search & Book Vehicles</h2>
      <div className="space-y-4 max-w-md mb-6">
        <div>
          <label className="block mb-1 font-medium">Capacity Required (Kg):</label>
          <input
            name="capacityRequired"
            type="number"
            value={form.capacityRequired}
            onChange={handleChange}
            min="1"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">From Pincode:</label>
          <input
            name="fromPincode"
            value={form.fromPincode}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">To Pincode:</label>
          <input
            name="toPincode"
            value={form.toPincode}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Start Date & Time:</label>
          <input
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          onClick={searchAvailability}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Availability'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {bookingStatus && <p className="text-green-600 mb-4">{bookingStatus}</p>}

      <div>
        {vehicles.length === 0 && !loading && <p>No vehicles available.</p>}
        {vehicles.map(vehicle => (
          <div
            key={vehicle._id}
            className="border border-gray-300 rounded p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <p><strong>Name:</strong> {vehicle.name}</p>
              <p><strong>Capacity:</strong> {vehicle.capacityKg} Kg</p>
              <p><strong>Tyres:</strong> {vehicle.tyres}</p>
              <p><strong>Estimated Ride Duration:</strong> {vehicle.estimatedRideDurationHours} hours</p>
            </div>
            <button
              onClick={() => bookVehicle(vehicle._id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBook;
