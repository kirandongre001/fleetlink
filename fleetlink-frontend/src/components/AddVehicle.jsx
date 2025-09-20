import { useState } from "react";
import { useDispatch } from "react-redux";
import { addVehicle } from "../features/VehiclesSlice";


export default function AddVehicle() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", capacityKg: "", tyres: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    debugger
    dispatch(addVehicle(form))
      .unwrap()
      .then(() => setMsg("Vehicle added successfully"))
      .catch(() => setMsg("Error adding vehicle"));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity (kg)"
          className="w-full p-2 border rounded"
          value={form.capacityKg}
          onChange={(e) => setForm({ ...form, capacityKg: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Tyres"
          className="w-full p-2 border rounded"
          value={form.tyres}
          onChange={(e) => setForm({ ...form, tyres: e.target.value })}
          required
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Add Vehicle
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}

