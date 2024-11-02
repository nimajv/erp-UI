import { AxiosError } from "axios"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { ApiError, TCompanies, ICompany } from "../../app/types"
import { getCompaniesRequest } from "./companyAPI"
import { RootState } from "../../app/store"

export interface companyState {
  error: string
  companies: ICompany[]
  status: "idle" | "loading" | "failed"
}

const initialState: companyState = {
  error: "",
  status: "idle",
  companies: [],
}

export const getCompanies = createAsyncThunk<
  TCompanies,
  void,
  { rejectValue: ApiError }
>("company/getAll", async (_, thunkApi) => {
  try {
    const response = await getCompaniesRequest()
    return response?.data
  } catch (err) {
    const error = err as AxiosError<ApiError>
    return thunkApi.rejectWithValue(error.response?.data!)
  }
})

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.error = ""
        state.status = "loading"
      })
      .addCase(
        getCompanies.fulfilled,
        (state, action: PayloadAction<TCompanies>) => {
          state.error = ""
          state.status = "idle"
          state.companies = action.payload.data! as ICompany[]
        },
      )
      .addCase(getCompanies.rejected, (state) => {
        state.status = "failed"
        state.error = "Error on get companies"
      })
  },
})

export const selectCompanies = (state: RootState) => state.company.companies
export const selectGetCompaniesLoading = (state: RootState) =>
  state.company.status === "loading"

export default companySlice.reducer
