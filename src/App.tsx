import React from "react"
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom"
import { useAppSelector } from "./app/hooks"
import PublicRoutes from "./routes/PublicRoutes"
import PrivateRoutes from "./routes/PrivateRoutes"
import { selectIsAuthenticated } from "./features/auth/authSlice"
import "./stylesheets/main.scss"

function App() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const routes = [
    ...PublicRoutes(),
    ...PrivateRoutes(),
    {
      path: "/",
      element: isAuthenticated ? (
        <Navigate to="/profile" replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
  ]

  // Add the redirect route for the root path
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default App
