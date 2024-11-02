import { useEffect } from "react"

interface Props<T> {
  onChange: (value: T) => void
  value: T
}

export function FormikObserver<T extends object>(props: Props<T>) {
  useEffect(() => {
    props.onChange(props.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.values(props.value).join(", ")])
  return null
}

FormikObserver.defaultProps = {
  onChange: () => null,
}
