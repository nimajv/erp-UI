import React, { forwardRef } from "react"
import { Button as MuiButton, ButtonProps } from "@mui/material"

const Button: React.FC<ButtonProps & { modifier?: string }> = forwardRef(
  ({ size, variant, onClick, modifier, className, children, ...rest }, ref) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant || "contained"}
        size={size || "medium"}
        onClick={onClick}
        className={
          className + ` button ${modifier ? "button--state-" + modifier : ""}`
        }
        {...rest}
      >
        {children}
      </MuiButton>
    )
  },
)

export default Button
