import React, { SyntheticEvent } from "react"
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material"
import { useFormikContext } from "formik"

const CheckBoxFormik = ({
  name,
  label,
  ...rest
}: {
  name: string
  label: string
} & Omit<FormControlLabelProps, "control">) => {
  const { values, setFieldValue } = useFormikContext<any>()

  return (
    <FormControlLabel
      control={<Checkbox checked={values[name]} />}
      label={label}
      name={name}
      onChange={() => setFieldValue(name, !values[name])}
      {...rest}
    />
  )
}

export default CheckBoxFormik
