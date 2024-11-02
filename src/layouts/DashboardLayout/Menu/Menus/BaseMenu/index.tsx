// @ts-nocheck

import React from "react"
import MenuItem from "../../MenuItem"

import { useAppSelector } from "../../../../../app/hooks"
import { selectServiceItems } from "../../../../../features/profile/ProfileHome/serviceSlice"

interface BaseMenuProps {
  name: string
}

const BaseMenu = ({ name, ...rest }: BaseMenuProps) => {
  const services = useAppSelector(selectServiceItems)[name]
  return (
    <>
      <ul className="menu" {...rest}>
        {services?.map((menu, index) => {
          return <MenuItem item={menu} key={index} depthLevel={0} />
        })}
      </ul>
    </>
  )
}

export default BaseMenu
