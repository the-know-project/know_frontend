import { configureStore } from "@reduxjs/toolkit";
import {
  PURGE,
  PAUSE,
  REGISTER,
  REHYDRATE,
  FLUSH,
  PERSIST,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./slice/authSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PURGE, REGISTER, REHYDRATE, PERSIST],
      },
    }),
});
