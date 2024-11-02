import * as React from "react"
import {
  Box,
  Menu,
  Button,
  MenuItem,
  BoxProps,
  ButtonProps,
  MenuItemProps,
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"

const DropDown = ({
  children,
  id,
  onChangeItem,
  ...rest
}: BoxProps & {
  children: React.ReactElement[]
  onChangeItem: (item: string) => void
}) => {
  let out = null
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const selectedItem = e.currentTarget.dataset["menuItem"]
    selectedItem && onChangeItem(selectedItem)
    setAnchorEl(null)
  }

  if (children?.length > 0) {
    const _title = children?.find((child) => child?.type === DropDownTitle)
    const _content = children?.find((child) => child?.type === DropDownContent)

    if (_title && _content?.props.children?.length > 0) {
      out = (
        <Box {...rest}>
          {React.cloneElement(_title, {
            onClick: handleClick,
            id: `${id}_button`,
            "aria-expanded": open ? "true" : undefined,
            "aria-controls": open ? `${id}_menu` : undefined,
            endIcon: <ExpandMore />,
          })}
          <Menu
            id={`${id}_menu`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": `${id}_button`,
            }}
          >
            {_content?.props.children?.map(
              (item: React.ReactElement, idx: number) => {
                return React.cloneElement(item, {
                  key: idx,
                  onClick: handleClose,
                })
              },
            )}
          </Menu>
        </Box>
      )
    }
  }

  return out
}

const DropDownTitle = (DropDown.Title = ({
  children,
  ...rest
}: ButtonProps) => {
  return (
    <Button aria-haspopup="true" disableRipple {...rest}>
      {children}
    </Button>
  )
})

DropDown.Item = ({ children, value, ...rest }: MenuItemProps) => {
  return (
    <MenuItem data-menu-item={value} {...rest}>
      {children}
    </MenuItem>
  )
}

const DropDownContent = (DropDown.Content = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <>{children}</>
})

export default DropDown
