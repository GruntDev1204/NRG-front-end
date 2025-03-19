import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  user: any
  isLogin: boolean
  token: string
}

const initialState: AuthState = { user: {}, isLogin: false, token: "" }

const authSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
  },
})

export const { setUser, setIsLogin, setToken } = authSlice.actions
export default authSlice.reducer
