import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { ThemeProvider } from "@emotion/react"

import "./i18n"
import App from "./App"
import theme from "./theme"
import "react-toastify/dist/ReactToastify.css"
import { persistor, store } from "./app/store"
import { PersistGate } from "redux-persist/integration/react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
        <ToastContainer />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>,
)
