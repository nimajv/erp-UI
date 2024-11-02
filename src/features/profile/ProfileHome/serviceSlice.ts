import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Service } from "../../../app/types"
import { requestItems } from "../../../data/menus/RequestMenu/items"
import { integrationItems } from "../../../data/menus/IntegrationMenu/items"
import { RootState } from "../../../app/store"

const initialState: { items: { [key: string]: Service }; favs: string[] } = {
  items: {
    // Request: requestItems,
    Integration: integrationItems,
  },
  favs: [],
}

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    addToFav(state, action: PayloadAction<string>) {
      state.favs = [...state.favs, action.payload]
    },
    removeFromFav(state, action: PayloadAction<string>) {
      state.favs = state.favs.filter((item) => item !== action.payload)
    },
  },
})

export const { addToFav, removeFromFav } = serviceSlice.actions
export const selectServiceItems = (state: RootState) => state.service.items
export const selectFavItems = (state: RootState) => state.service.favs

export default serviceSlice.reducer
