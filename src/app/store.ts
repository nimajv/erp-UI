import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"

import authSlice from "../features/auth/authSlice"
import generalSlice from "../features/general/generalSlice"
import companySlice from "../features/general/companySlice"
import documentSlice from "../features/profile/documentSlice"
import serviceSlice from "../features/profile/ProfileHome/serviceSlice"

const rootPersistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["service", "company", "document"],
}

const servicePersistConfig = {
  key: "service",
  storage: storage,
  blacklist: ["items"],
}

const documentPersistConfig = {
  key: "document",
  storage: storage,
  whitelist: [],
}

const rootReducer = combineReducers({
  service: persistReducer(servicePersistConfig, serviceSlice),
  document: persistReducer(documentPersistConfig, documentSlice),
  general: generalSlice,
  auth: authSlice,
  company: companySlice,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
