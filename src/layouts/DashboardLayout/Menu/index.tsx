import * as React from "react"
import { Close } from "@mui/icons-material"

import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import {
  activeMenu,
  deactiveMenu,
  selectIsMenuActive,
} from "../../../features/general/generalSlice"
import { useWindowSize } from "../../../hooks"
import { IntegrationMenu, RequestMenu } from "./Menus"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import Container from "../../../components/common/Container"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function MenuTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`menu-tabpanel-${index}`}
      aria-labelledby={`menu-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `menu-tab-${index}`,
    "aria-controls": `menu-tabpanel-${index}`,
  }
}

export default function BasicTabs() {
  const dispatch = useAppDispatch()
  const [width] = useWindowSize()
  const [value, setValue] = React.useState(0)
  const isMenuActive = useAppSelector(selectIsMenuActive)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  React.useLayoutEffect(() => {
    width !== 0 && width < 767 && dispatch(deactiveMenu())
    width !== 0 && width >= 767 && dispatch(activeMenu())
  }, [dispatch, width])

  return (
    <Box className="menu-wrapper">
      <Container>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="aria-label"
          className="menu-wrapper__titles"
          onClick={() => !isMenuActive && dispatch(activeMenu())}
        >
          <Tab label="Integration" {...a11yProps(0)} disableRipple />
          {/* <Tab label="Request" {...a11yProps(1)} disableRipple /> */}
        </Tabs>
      </Container>

      <hr />

      {isMenuActive && (
        <Container>
          <MenuTabPanel value={value} index={0}>
            <div onClick={() => dispatch(deactiveMenu())}>{<Close />}</div>
            <IntegrationMenu />
          </MenuTabPanel>
          {/* <MenuTabPanel value={value} index={1}>
            <div onClick={() => dispatch(deactiveMenu())}>{<Close />}</div>
            <RequestMenu />
          </MenuTabPanel> */}
        </Container>
      )}
    </Box>
  )
}
