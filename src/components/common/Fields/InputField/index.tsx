import React from "react"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { TextFieldProps } from "@mui/material"

type InputFieldProps = TextFieldProps & {}

const InputField = ({
  name,
  type,
  label,
  fullWidth,
  inputProps,
  InputLabelProps,
  inputRef,
  value,
  onChange,
  ...rest
}: InputFieldProps) => {
  return (
    <Field
      fullWidth
      name={name}
      type={type}
      size="small"
      label={label}
      value={value}
      component={TextField}
      {...(inputRef ? { inputRef } : {})}
      {...(onChange ? { onChange } : {})}
      InputLabelProps={{ shrink: value, ...InputLabelProps }}
      {...rest}
    />
  )
}

export default React.memo(InputField)
