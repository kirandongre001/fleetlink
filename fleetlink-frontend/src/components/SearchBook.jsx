// ...existing code...
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchVehicles } from "../features/VehiclesSlice";
import { bookVehicle } from "../features/BookingsSlice";
import VehicleCard from "./VehicleCard";

export default function SearchBook() {
    const dispatch = useDispatch();
    const vehicles = useSelector((state) => state.vehicles.searchResults);
    const bookingError = useSelector((state) => state.bookings.error);

    const [form, setForm] = useState({
        capacityRequired: "",
        fromPincode: "",
        toPincode: "",
        startTime: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();

        // Make sure all required fields are filled
        if (
            !form.capacityRequired ||
            !form.fromPincode ||
            !form.toPincode ||
            !form.startTime
        ) {
            alert("Please fill all fields");
            return;
        }

        // Dispatch searchVehicles
        dispatch(
            searchVehicles({
                capacityRequired: Number(form.capacityRequired), // number
                fromPincode: form.fromPincode.trim(),
                toPincode: form.toPincode.trim(),
                startTime: new Date(form.startTime).toISOString(), // ISO string
            })
        );
    };

    const handleBook = (vehicle) => {
        dispatch(
            bookVehicle({
                vehicleId: vehicle._id,
                ...form,
                startTime: form.startTime ? new Date(form.startTime).toISOString() : "",
                customerId: "demoCustomer",
            })
        );
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Search & Book Vehicle</h2>
            <form onSubmit={handleSearch} className="space-y-4 mb-6">
                <input
                    type="number"
                    placeholder="Capacity Required"
                    className="w-full p-2 border rounded"
                    value={form.capacityRequired}
                    onChange={(e) =>
                        setForm({ ...form, capacityRequired: e.target.value })
                    }
                    required
                />
                <input
                    type="text"
                    placeholder="From Pincode"
                    className="w-full p-2 border rounded"
                    value={form.fromPincode}
                    onChange={(e) => setForm({ ...form, fromPincode: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="To Pincode"
                    className="w-full p-2 border rounded"
                    value={form.toPincode}
                    onChange={(e) => setForm({ ...form, toPincode: e.target.value })}
                    required
                />
                <input
                    type="datetime-local"
                    className="w-full p-2 border rounded"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Search Availability
                </button>
            </form>

            {vehicles?.length > 0 ? (
                <div className="space-y-4">
                    {vehicles.map((v) => (
                        <VehicleCard key={v._id} vehicle={v} onBook={handleBook} />
                    ))}
                </div>
            ) : (
                <p>No vehicles found.</p>
            )}

            {bookingError && (
                <p className="text-red-600 mt-4">Error: {bookingError}</p>
            )}
        </div>
    );
}
// ...existing code...