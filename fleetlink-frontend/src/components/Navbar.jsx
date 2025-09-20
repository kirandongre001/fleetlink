import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className=" text-white p-4 flex justify-between bg-gray-800">
      <h1 className="text-xl font-bold">FleetLink</h1>
      <div className="space-x-6 text-xl font-extrabold p-4 pr-20 ">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/add-vehicle" className="hover:underline ">Add Vehicle</Link>
        <Link to="/search-book" className="hover:underline">Search & Book</Link>
      </div>
    </nav>
  );
}
