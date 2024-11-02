import React, { forwardRef } from "react"
import { Container as MuiContainer, ContainerProps } from "@mui/material"

const Container: React.FC<ContainerProps> = forwardRef(function Container(
  { children, maxWidth = "xl", ...rest },
  ref,
) {
  return (
    <MuiContainer ref={ref} maxWidth={maxWidth} {...rest}>
      {children}
    </MuiContainer>
  )
})
export default Container
