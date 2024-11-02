import { createTheme } from "@mui/material"

const theme: {} = createTheme({
  palette: {
    primary: {
      main: "#1281AB",
      light: "#e0f4fd",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },

    fontFamily: [
      "Glory",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
})

export default theme
