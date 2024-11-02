import React from "react"
import { Tooltip as MuiTooltip, TooltipProps } from "@mui/material"

const Tooltip: React.FC<TooltipProps & { modifier?: string }> = ({
  children,
  title,
  modifier = "primary",
  placement = "top",
  ...props
}) => {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow
      componentsProps={{
        tooltip: {
          className: `tooltip ${modifier ? "tooltip--state-" + modifier : ""}`,
        },
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  )
}

export default Tooltip
