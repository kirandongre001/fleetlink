// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddVehicle from "./components/AddVehicle";
import SearchBook from "./components/SearchBook";
import Navbar from "./components/Navbar";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/search-book" element={<SearchBook />} />
      </Routes>
    </BrowserRouter>
  );
}
