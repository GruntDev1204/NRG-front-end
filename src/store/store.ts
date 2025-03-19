import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import productSlice from "./slices/productsSlice"
export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
