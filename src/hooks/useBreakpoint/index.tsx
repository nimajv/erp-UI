import { createBreakpoint } from "react-use"

const breakPoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
}

export const useBreakpoint = createBreakpoint(breakPoints)
