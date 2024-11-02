import React from "react"
import { ReactElement } from "react"
import Cookies from "js-cookie"
import CryptoJS from "crypto-js"

import { TItem, TList } from "../app/types"
import constants from "./constants"
import moment from "moment"
import { toast } from "react-toastify"

export const isPlainObject = (input: any) => {
  return input && !Array.isArray(input) && typeof input === "object"
}

export const addOrRemove = <T>(arr: T[], item: T) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

export const findNestedObj = (
  entireObj: object,
  keyToFind: string,
  valToFind: string,
) => {
  let foundObj: object = {}
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      foundObj = nestedValue
    }
    return nestedValue
  })
  return foundObj
}

export const flattenRecursive = (recObj: TList) => {
  let result = [] as TItem[]
  const { sub, ...another } = recObj

  result = [...result, another]

  if (sub) {
    sub.forEach((el: any) => {
      result = [...result, ...flattenRecursive(el)]
    })
  }

  return result
}

export const filterRecursive = (arr: TList[], term: string) => {
  const matches: TList[] = []
  if (!Array.isArray(arr)) return matches

  arr.forEach(function (i) {
    if (i?.title!.toLowerCase().includes(term)) {
      matches.push(i)
    } else {
      let childResults = filterRecursive(i.sub!, term)
      if (childResults.length)
        matches.push(Object.assign({}, i, { sub: childResults }))
    }
  })

  return matches
}

export const isReactFragment = (variableToInspect: ReactElement) => {
  if (variableToInspect!.type) {
    return variableToInspect!.type === React.Fragment
  }
  return variableToInspect === (React.Fragment as unknown as ReactElement)
}

export const encryptData = (value: any) => {
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    constants.COOKIES_SECRET_PASSWORD,
  ).toString()

  return data
}

export const decryptData = (value: any) => {
  const bytes = CryptoJS.AES.decrypt(value, constants.COOKIES_SECRET_PASSWORD)
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  return data
}

export const cookies = Cookies.withConverter({
  write: function (value: any) {
    return encryptData(value)
  },
  read: function (value: string) {
    return decryptData(value)
  },
})

export const getElHeight = (element: HTMLElement) => {
  return element.getBoundingClientRect().height
}

export const toIsoLocalTime = (value: any) => {
  if (value instanceof Date === false) value = new Date()
  const off = value.getTimezoneOffset() * -1
  const del = value.getMilliseconds() ? "Z" : "." // have milliseconds ?
  value = new Date(value.getTime() + off * 60000) // add or subtract time zone
  return (
    value.toISOString().split(del)[0] +
    (off < 0 ? "-" : "+") +
    ("0" + Math.abs(Math.floor(off / 60))).substr(-2) +
    ":" +
    ("0" + Math.abs(off % 60)).substr(-2)
  )
}

export const parseDate = (iso_date: string) => {
  return new Date(Date.parse(iso_date))
}

export const toEnDigit = (str: string) => {
  const persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]

  if (typeof str === "string") {
    for (let i = 0; i < 10; i++) {
      str = str
        .replace(persianNumbers[i], i as unknown as string)
        .replace(arabicNumbers[i], i as unknown as string)
    }
  }
  return str
}

export const checkDate = (dateStr: string, dateFormat: string) => {
  return moment(dateStr, dateFormat, true).isValid()
}

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea")
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand("copy")
  } catch (err) {
    console.error("Unable to copy to clipboard", err)
  }
  document.body.removeChild(textArea)
}

export const copyWithToast = (copyText: string) => {
  if (copyText) {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(copyText)
    } else {
      unsecuredCopyToClipboard(copyText)
    }
    toast.success("Copied Successfully")
  } else {
    toast.error("Error on Empty Text")
  }
}
