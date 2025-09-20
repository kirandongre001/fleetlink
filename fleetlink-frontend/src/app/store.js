import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "../features/VehiclesSlice";
import bookingsReducer from "../features/BookingsSlice";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    bookings: bookingsReducer,
  },
});
