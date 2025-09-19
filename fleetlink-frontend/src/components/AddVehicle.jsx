import React, { useState } from 'react';
import axios from 'axios';

const AddVehicle = () => {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        capacityKg: Number(form.capacityKg),
        tyres: Number(form.tyres)
      };
      const res = await axios.post('http://localhost:4000/api/vehicles', payload);
      setMessage(`Vehicle added with ID: ${res.data._id}`);
      setForm({ name: '', capacityKg: '', tyres: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Capacity (Kg):</label>
          <input
            name="capacityKg"
            type="number"
            value={form.capacityKg}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tyres:</label>
          <input
            name="tyres"
            type="number"
            value={form.tyres}
            onChange={handleChange}
            required
            min="1"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AddVehicle;
