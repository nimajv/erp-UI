import React from "react"
import WithPaper from "../../../../common/WithPaper"
import { DeleteOutline } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../../../../../app/hooks"
import { removeFromFav } from "../../../../../features/profile/ProfileHome/serviceSlice"

type HomeServiceProps = {
  title: string
  path: string
  url: string
}

const HomeService = ({ title, path, url }: HomeServiceProps) => {
  const dispatch = useAppDispatch()
  return (
    <div className="home-service">
      <Link to={url} className="home-service__content">
        <span>{title}</span>
        <span>{path}</span>
      </Link>
      <div
        className="home-service__icon"
        onClick={() => dispatch(removeFromFav(url))}
      >
        <DeleteOutline color="error" />
      </div>
    </div>
  )
}

export default WithPaper(HomeService)
