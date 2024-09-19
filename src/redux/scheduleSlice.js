import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../constants";

const getAuthToken = () => sessionStorage.getItem("authToken");

const initialState = {
  schedules: [],
  schedule: {},
  status: "idle",
  error: null,
  downloadStatus: "idle",
  downloadError: null,
  isUpdated: {},
};

export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/get-schedules`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  "schedules/fetchScheduleById",
  async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/get-schedule/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
);

export const addSchedule = createAsyncThunk(
  "schedules/addSchedule",
  async (newSchedule) => {
    const response = await axios.post(
      `${API_URL}/api/v1/add-schedule`,
      newSchedule,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/updateSchedule",
  async (schedule) => {
    const response = await axios.put(
      `${API_URL}/api/v1/schedule/${schedule.id}`,
      schedule,
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
    return response.data;
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/deleteSchedule",
  async (id) => {
    await axios.delete(`${API_URL}/api/v1/remove-schedule/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return id;
  }
);

// New thunk for downloading a file
export const downloadSchedulePDF = createAsyncThunk(
  "schedules/downloadSchedulePDF",
  async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/get-schedule-pdf/${id}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "schedule.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        state.schedules.push(action.payload);
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.isUpdated = action.payload.message;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        );
      })
      .addCase(fetchScheduleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedule = action.payload;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(downloadSchedulePDF.pending, (state) => {
        state.downloadStatus = "loading";
      })
      .addCase(downloadSchedulePDF.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(downloadSchedulePDF.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.downloadError = action.error.message;
      });
  },
});

export default scheduleSlice.reducer;
