import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import CustomizerReducer from "./customizer/CustomizerSlice";
import snackReducer from "./snack/snackSlice";
import loadingReducer from "./loading/loadingSlice";
import clientDataReducer from "./clientData/clientDataSlice";

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: {
    clientData: clientDataReducer,
    snack: snackReducer,
    loading: loadingReducer,
    customizer: persistReducer<any>(persistConfig, CustomizerReducer),
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const rootReducer = combineReducers({
  snack: snackReducer,
  loading: loadingReducer,
  customizer: CustomizerReducer,
  clientData: clientDataReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
