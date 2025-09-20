export default function VehicleCard({ vehicle, onBook }) {
  return (
    <div className="p-4 border rounded-lg shadow bg-white flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{vehicle.name}</h3>
        <p>Capacity: {vehicle.capacityKg} kg</p>
        <p>Tyres: {vehicle.tyres}</p>
        {vehicle.estimatedRideDurationHours && (
          <p>Duration: {vehicle.estimatedRideDurationHours} hrs</p>
        )}
      </div>
      {onBook && (
        <button
          onClick={() => onBook(vehicle)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      )}
    </div>
  );
}
