
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";


export const addVehicle = createAsyncThunk(
  "vehicles/addVehicle",
  async (vehicle) => {
    const res = await api.post("/vehicles", vehicle);
    return res.data;
  }
);

export const searchVehicles = createAsyncThunk(
  "vehicles/searchVehicles",
  async (params) => {
    console.log("Dispatching params:", {
  capacityRequired: Number(params.capacityRequired),
  fromPincode: params.fromPincode.trim(),
  toPincode: params.toPincode.trim(),
  startTime: new Date(params.startTime).toISOString(),
});
    const res = await api.get("/vehicles/available", { params });
    return res.data;
  }
);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: { list: [], status: null, searchResults: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(searchVehicles.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export default vehiclesSlice.reducer;
