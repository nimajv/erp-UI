import React from "react"
import { Navigate } from "react-router-dom"
import Login from "../features/auth/Login"

export default function PublicRoutes() {
  return [
    { path: "/", element: <Login /> },
    { path: "*", element: <Navigate to="/" replace /> },
  ]
}
