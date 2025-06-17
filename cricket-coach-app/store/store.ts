import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import userReducer from "./userSlice"

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	whitelist: ["user"],
}

const rootReducer = combineReducers({
	user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// ✅ FIXED configureStore with proper middleware
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
