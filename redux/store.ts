import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/authSlice";

const rootReducer = combineReducers({
  state: authReducer,
});

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

export const persistor = persistStore(store); // ✅ This fixes the error

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
