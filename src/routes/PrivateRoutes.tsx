import { lazily } from "react-lazily"
import { Navigate } from "react-router-dom"
import { DashboardLayout } from "../layouts"
import { useAppSelector } from "../app/hooks"
import { selectUser } from "../features/auth/authSlice"

const {
  RegisterDocument,
  ProfileHome,
  VictoriNox,
  DeleteDocument,
  UserAccess,
} = lazily(() => import("../features/profile"))

export default function PrivateRoutes() {
  const user = useAppSelector(selectUser)

  console.log("User Roles:", user)

  const isAdmin =
    Array.isArray(user.userinfo) && user.userinfo.includes("Admin")

  return [
    {
      path: "/profile",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <ProfileHome /> },
        { path: "register-document", element: <RegisterDocument /> },
        { path: "data-import", element: <VictoriNox /> },
        { path: "delete-document", element: <DeleteDocument /> },
        {
          path: "user-access",
          element: isAdmin ? (
            <UserAccess />
          ) : (
            <Navigate to="/profile" replace />
          ),
        },
        { path: "*", element: <Navigate to="/profile" replace /> },
      ],
    },
  ]
}
