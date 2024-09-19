import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../constants";

// Initial state of the auth slice
const initialState = {
  user: null,
  status: "idle",
  error: null,
};

// Thunk for handling login
export const loginUser = createAsyncThunk(
  "auth/signin", // Action type
  async ({ username, password }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/signin`,
        { username, password }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store the token in sessionStorage
      sessionStorage.setItem("authToken", response.data.token);

      return response.data; // Return the user data or token as needed
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer for logging out
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
