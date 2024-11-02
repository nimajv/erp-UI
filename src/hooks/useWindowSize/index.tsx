import { debounce } from "lodash"
import { useLayoutEffect, useState } from "react"

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    const updateSize = debounce(() => {
      setSize([window.innerWidth, window.innerHeight])
    }, 10)

    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}
