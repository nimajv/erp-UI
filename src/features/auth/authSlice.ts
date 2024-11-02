import {
  Dispatch,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit"
import { toast } from "react-toastify"

import { RootState } from "../../app/store"
import { ILogin, IUser } from "../../app/types"
import { cookies } from "../../utils/functions"
import { MySwal } from "../../utils/swal"
import { clearCompany } from "../general/generalSlice"
import { loginUserRequest } from "./authAPI"

export interface AuthState {
  user: Omit<IUser, "token">
  status: "idle" | "loading" | "failed"
}

const initialState: AuthState = {
  user: {} as Omit<IUser, "token">,
  status: "idle",
}

export const login = createAsyncThunk("auth/login", async (body: ILogin) => {
  const response: any = await loginUserRequest(body)
  return response?.data as any
})

export const logout = () => (dispatch: Dispatch) => {
  dispatch(clearGeneral())
  dispatch(clearCompany())
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearGeneral: (state) => {
      MySwal.close()
      cookies.remove("token")
      state.user = initialState.user
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = "idle"
        const { token, ...userData } = action.payload

        state.user = userData
        cookies.set("token", token, { expires: 365 })
      })
      .addCase(login.rejected, (state) => {
        state.status = "failed"
        toast.error("Login failed")
      })
  },
})

const { clearGeneral } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  cookies.get("token")?.length > 0 &&
  !state.auth.user.isNotAllowed &&
  !state.auth.user.isLockedOut &&
  state.auth.user.result &&
  state.auth.user.username

export default authSlice.reducer
