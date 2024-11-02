import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TGeneral } from "../../app/types"
import { RootState } from "../../app/store"

const initialState: TGeneral = {
  company: "",
  isMenuActive: window.innerWidth > 767,
}
export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    changeCompany(state, action: PayloadAction<string>) {
      state.company = action.payload
    },
    activeMenu: (state) => {
      state.isMenuActive = true
    },
    clearCompany(state) {
      state.company = ""
    },
    deactiveMenu: (state) => {
      if (window.innerWidth < 767) {
        state.isMenuActive = false
      }
    },
  },
})

export const { changeCompany, activeMenu, deactiveMenu, clearCompany } =
  generalSlice.actions

export const selectCompany = (state: RootState) => state.general.company
export const selectIsMenuActive = (state: RootState) =>
  state.general.isMenuActive

export default generalSlice.reducer
