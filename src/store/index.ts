import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import healthReducer from "./healthSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    health: healthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
