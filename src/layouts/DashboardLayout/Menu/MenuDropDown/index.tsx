import React from "react"
import MenuItem from "../MenuItem"

const MenuDropDown = ({
  submenu,
  depthLevel,
  dropdown,
}: {
  submenu: any
  depthLevel: number
  dropdown: boolean
}) => {
  depthLevel = depthLevel + 1
  const dropdownClass = depthLevel > 1 ? "dropdown dropdown--state-submenu" : ""

  return (
    submenu?.length > 0 && (
      <ul className={`dropdown ${dropdownClass} ${!dropdown ? "d-none" : ""}`}>
        {submenu?.map((submenu: any, index: React.Key | null | undefined) => (
          <MenuItem item={submenu} key={index} depthLevel={depthLevel} />
        ))}
      </ul>
    )
  )
}

export default MenuDropDown
