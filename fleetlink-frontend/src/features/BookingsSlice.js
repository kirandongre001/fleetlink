
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";


export const bookVehicle = createAsyncThunk(
  "bookings/bookVehicle",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await api.post("/bookings", bookingData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: { list: [], status: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookVehicle.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.error = null;
      })
      .addCase(bookVehicle.rejected, (state, action) => {
        state.error = action.payload?.message || "Booking failed";
      });
  },
});

export default bookingsSlice.reducer;
