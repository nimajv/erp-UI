import gregorian from "react-date-object/calendars/gregorian"
import persian from "react-date-object/calendars/persian"
import gregorian_en from "react-date-object/locales/gregorian_en"
import persian_fa from "react-date-object/locales/persian_fa"
import { FilterStates, ObjectWithValuesOfEnumAsKeys } from "../app/types"

export const FilterStatesKeys: ObjectWithValuesOfEnumAsKeys = {
  [FilterStates.SUCCESS]: "delivery",
  [FilterStates.FAIL]: "failed",
  [FilterStates.PARTIAL_SUCCESS]: "setting",
  [FilterStates.RUNNING]: "play",
  [FilterStates.DELETE_DOCUMENT]: "delete",
  [FilterStates.EMPTY_ROW]: "layer",
  [FilterStates.POSTED]: "success",
  [FilterStates.PARTIAL_POSTING]: "partial",
  [FilterStates.RUNNING_POSTING]: "running",
  // [FilterStates.DELETE_BATCH]: "delete",
  [FilterStates.PARTIAL_FAIL]: "settingp",
}

const constants = {
  HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  headers: {
    "Content-Type": "application/json",
  },
  LANGUAGES: [{ label: "English", code: "en" }],
  CALENDAR_LANGS: {
    fa: {
      calendar: persian,
      locale: persian_fa,
    },
    en: {
      calendar: gregorian,
      locale: gregorian_en,
    },
  },
  companies: {
    SnappDrive: "snappDrive",
    SnappBox: "snappBox",
    SnappFood: "snappFood",
    SnappTrip: "snappTrip",
    SnappGrocery: "snappGrocery",
    SnappMarketPro: "snappMarketPro",
    SnappKitchen: "snappKitchen",
    SnappShop: "snappShop",
    SnappDoctor: "snappDoctor",
    SnappSupply: "snappSupply",
    SnappStore: "snappStore",
    SnappPay: "snappPay",
  },
  COOKIES_SECRET_PASSWORD: import.meta.env.VITE_APP_HOST_URL,
  PAGINATION_STATES: {
    default: "PAGINATION_DEFAULT_STATE",
    initial: "PAGINATION_INITIAL_STATE",
    refresh: "PAGINATION_REFRESH_STATE",
  },
}

export default constants
