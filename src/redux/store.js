import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import scheduleReducer from "./scheduleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedules: scheduleReducer,
  },
});
