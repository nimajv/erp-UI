import { useState } from "react"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

import MenuDropDown from "../MenuDropDown"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../../app/hooks"
import { deactiveMenu } from "../../../../features/general/generalSlice"

const MenuItem = ({ item, depthLevel }: { item: any; depthLevel: number }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [dropdown, setDropdown] = useState<boolean>(false)

  const onMouseEnter = () => {
    setDropdown(true)
  }

  const onMouseLeave = () => {
    setDropdown(false)
  }

  const toggleDropdown = (event: any) => {
    event.stopPropagation()
    setDropdown(!dropdown)
  }

  const onChooseMenu = (url: string) => {
    if (url?.length) {
      navigate(url)
      dispatch(deactiveMenu())
    }
  }

  return (
    <li
      className="menu__item menu-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={dropdown ? "true" : "false"}
        onClick={toggleDropdown}
      >
        {item?.sub?.length > 0 ? (
          <span>{item.title}</span>
        ) : (
          <span
            className="menu-item__title"
            onClick={() => onChooseMenu(item?.url)}
          >
            {item.title}
          </span>
        )}
        {item?.sub?.length > 0 && (dropdown ? <ExpandMore /> : <ExpandLess />)}
      </button>
      <MenuDropDown
        submenu={item?.sub}
        depthLevel={depthLevel}
        dropdown={dropdown}
      />
    </li>
  )
}

export default MenuItem
