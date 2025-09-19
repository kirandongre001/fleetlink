import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddVehicle from './components/AddVehicle';
import SearchBook from './components/SearchBook';
function App() {
  return (
    <Router>
      <div className="p-6 max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link to="/" className="mr-4 text-blue-600 hover:underline">Search & Book</Link>
          <Link to="/add-vehicle" className="text-blue-600 hover:underline">Add Vehicle</Link>
        </nav>
        <Routes>
          <Route path="/" element={<SearchBook />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;