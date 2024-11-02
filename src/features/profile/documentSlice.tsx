import { AxiosError } from "axios"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { RootState } from "../../app/store"
import { IDoc, TStates, RDContentValues, TDocs, IState } from "../../app/types"
import { getDocumentStatusRequest, getDocumentsRequest } from "./documentAPI"
import { reject } from "lodash"

export interface DDItem {
  id: string
  deletestrategyEnum: number
  isIfrs: boolean
}

export interface RDItem {
  id: string
  isIfrs: boolean
}

export interface DocumentState {
  documents: IDoc[]
  status: "idle" | "loading" | "failed"
  currentDoc: RDContentValues
  registerForceUpdate: boolean
  deleteForceUpdate: boolean
  docsForDelete: DDItem[]
  registeredDocs: RDItem[]
  states: IState[]
}

const initialState: DocumentState = {
  status: "idle",
  documents: [],
  currentDoc: {} as RDContentValues,
  registerForceUpdate: false,
  deleteForceUpdate: false,
  docsForDelete: [],
  registeredDocs: [],
  states: [],
}

export const getDocuments = createAsyncThunk<TDocs, void, { rejectValue: any }>(
  "document/getAll",
  async (_, thunkApi) => {
    try {
      const response = await getDocumentsRequest()
      return response?.data
    } catch (err) {
      const error = err as AxiosError<any>
      return thunkApi.rejectWithValue(error.response?.data!)
    }
  },
)

export const getDocumentStates = createAsyncThunk<
  TStates,
  void,
  { rejectValue: any }
>("document/states", async (_, thunkApi) => {
  try {
    const response = await getDocumentStatusRequest()
    return response?.data
  } catch (err) {
    const error = err as AxiosError<any>
    return thunkApi.rejectWithValue(error.response?.data!)
  }
})

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setCurrentDoc: (state, action: PayloadAction<RDContentValues>) => {
      state.currentDoc = action.payload
    },
    toggleRegisterForceUpdate: (state) => {
      state.registerForceUpdate = !state.registerForceUpdate
    },
    toggleDeleteForceUpdate: (state) => {
      state.deleteForceUpdate = !state.deleteForceUpdate
    },
    addToDocsForDelete: {
      reducer: (state, action: PayloadAction<DDItem>) => {
        state.docsForDelete = [...state.docsForDelete, action.payload]
      },
      prepare: (id: string, isIfrs: boolean) => {
        return { payload: { id, deletestrategyEnum: 0, isIfrs } }
      },
    },
    addToDocsDelete: (state, action: PayloadAction<DDItem>) => {
      state.docsForDelete = [...state.docsForDelete, action.payload]
    },
    removeFromDocsForDelete: (state, action: PayloadAction<string>) => {
      state.docsForDelete = state.docsForDelete.filter(
        (item) => item.id !== action.payload,
      )
    },
    changeDocForDelete: (state, action: PayloadAction<DDItem>) => {
      state.docsForDelete = state.docsForDelete?.map((item) =>
        item.id === action.payload.id
          ? { ...item, deletestrategyEnum: action.payload.deletestrategyEnum }
          : item,
      )
    },
    clearDocsForDelete: (state) => {
      state.docsForDelete = []
    },
    addToRegisteredDocs: (state, action: PayloadAction<RDItem>) => {
      if (
        state.registeredDocs.findIndex(
          (item) => item.id === action.payload.id,
        ) === -1
      ) {
        state.registeredDocs = [...state.registeredDocs, action.payload]
      }
    },
    removeFromRegisteredDocs: (state, action: PayloadAction<string>) => {
      state.registeredDocs = reject(state.registeredDocs, {
        id: action.payload,
      })
    },
    clearRegisteredDocs: (state) => {
      state.registeredDocs = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDocuments.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        getDocuments.fulfilled,
        (state, action: PayloadAction<TDocs>) => {
          state.status = "idle"
          state.documents = action.payload.data! as IDoc[]
        },
      )
      .addCase(getDocuments.rejected, (state) => {
        state.status = "failed"
      })
      .addCase(getDocumentStates.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        getDocumentStates.fulfilled,
        (state, action: PayloadAction<TStates>) => {
          state.status = "idle"
          state.states = action.payload.data! as IState[]
        },
      )
      .addCase(getDocumentStates.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const {
  setCurrentDoc,
  toggleRegisterForceUpdate,
  addToDocsForDelete,
  clearDocsForDelete,
  changeDocForDelete,
  addToDocsDelete,
  removeFromDocsForDelete,
  toggleDeleteForceUpdate,
  addToRegisteredDocs,
  removeFromRegisteredDocs,
  clearRegisteredDocs,
} = documentSlice.actions

export const selectDocs = (state: RootState) => state.document.documents

export const selectCurrentDoc = (state: RootState) => state.document.currentDoc

export const selectRegisterForceUpdate = (state: RootState) =>
  state.document.registerForceUpdate

export const selectDeleteForceUpdate = (state: RootState) =>
  state.document.deleteForceUpdate

export const selectDocsForDelete = (state: RootState) =>
  state.document.docsForDelete

export const selectRegisteredDocs = (state: RootState) =>
  state.document.registeredDocs

export const selectDocStates = (state: RootState) => state.document.states

export default documentSlice.reducer
