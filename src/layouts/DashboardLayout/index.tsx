import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import { BeatLoader } from "react-spinners"
import Header from "./Header"
import Menu from "./Menu"
import { ChooseCompany } from "../../components/ui/Modals/ProfileHome"
import { DashboardLoader } from "../../components/ui/HOC"

export default function DashboardLayout() {
  return (
    <DashboardLoader>
      <div className="dashboard">
        <ChooseCompany />
        <Header />
        <Menu />
        <div className="dashboard__content">
          <Suspense
            fallback={
              <div className="dashboard__loader">
                <BeatLoader color="midnightblue" size={35} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </DashboardLoader>
  )
}
