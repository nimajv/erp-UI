/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {
  AxiosError,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from "axios"

import Button from "../components/common/Button"
import Tooltip from "../components/common/Tooltip"
import { loadingAlert } from "../data/alerts"
import { logout } from "../features/auth/authSlice"
import constants from "../utils/constants"
import { cookies, copyWithToast } from "../utils/functions"
import { MySwal } from "../utils/swal"
import { IErrorRes } from "./types"

export const generalConf = {
  headers: constants.headers,
  withCredentials: true,
  baseURL: constants.HOST_URL,
}

const createAxios = (instanceConf?: CreateAxiosDefaults<any>) => {
  const newInstance = axios.create({ ...generalConf, ...instanceConf })

  newInstance.interceptors.request.use(
    async function (config) {
      const { store } = await import("../app/store")

      if (cookies.get("token")) {
        config.headers.Authorization = `Bearer ${cookies.get("token")}`
      }

      const {
        general: { company },
      } = store.getState()

      if (company.length > 0) {
        config.params = { ...config.params, company }
      }

      return config
    },
    function (error) {
      return Promise.reject(error)
    },
  )

  newInstance.interceptors.response.use(
    function (response) {
      return response
    },
    async function (error) {
      const err = error as AxiosError
      if (err.response?.status === 401) {
        const { store } = await import("../app/store")
        store.dispatch(logout())
        throw new axios.Cancel("Token expired.")
      }
      return Promise.reject(error)
    },
  )

  return newInstance
}

export const axiosClient = createAxios()
export const axiosWithAlert = createAxios()

axiosWithAlert.interceptors.request.use(
  (config) => {
    MySwal.fire(loadingAlert)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosWithAlert.interceptors.response.use(
  async function (response) {
    const mod = await import("../components/ui/SuccessMessages")

    const componentName: keyof typeof mod =
      response.config.headers["x-success-component"]

    if (!componentName) {
      // Display a generic success message or handle accordingly
      MySwal.fire({
        icon: "info",
        title: "Success!",
        text: response.data.message || "The operation was successful.",
        showCloseButton: true,
        showConfirmButton: false,
      })
      return response // Return response without showing any specific component
    }

    const Component = mod[componentName]
    const classPrefix = componentName.toLowerCase()

    // const element = document.createElement("div")
    // ReactDOM.createRoot(element!).render(<Component {...response} />)

    MySwal.fire({
      heightAuto: false,
      showCloseButton: true,
      showConfirmButton: false,
      html: <Component {...response} />,
      customClass: {
        popup: classPrefix + "__popup",
        container: classPrefix + "__container",
      },
    })

    return response
  },
  function (err) {
    if (axios.isCancel(err)) {
      return Promise.reject(err)
    }

    const error = err.response.data as IErrorRes
    const errorMsg = error?.Message || "Something went wrong!"

    const htmlError = (
      <Tooltip title={error?.DocId} modifier="error">
        <Button
          variant="text"
          modifier="error"
          onClick={() => {
            copyWithToast(error.DocId!)
          }}
        >
          {errorMsg}
        </Button>
      </Tooltip>
    )

    MySwal.fire({
      icon: "error",
      heightAuto: false,
      html: htmlError,
      showCloseButton: true,
      showConfirmButton: false,
    })

    return Promise.reject(error)
  },
)

export function getRequest<R>(URL: string) {
  return axiosClient.get<R>(`${URL}`)
}

export function postRequest<T, R>(
  URL: string,
  payload: T,
  config?: AxiosRequestConfig,
) {
  return axiosClient.post<T, R>(`${URL}`, payload, config)
}

export function patchRequest<T>(URL: string, payload: T) {
  return axiosClient.patch(`${URL}`, payload)
}

export function putRequest<T, R>(
  URL: string,
  payload: T,
  config?: AxiosRequestConfig,
) {
  return axiosClient.put<T, R>(`${URL}`, payload, config)
}

export function deleteRequest(URL: string) {
  return axiosClient.delete(`${URL}`)
}
