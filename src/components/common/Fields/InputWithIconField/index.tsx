import React from "react"
import {
  InputAdornment,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material"
import InputField from "../InputField"

type InputWithIconFieldProps = MuiTextFieldProps & {
  iconComponent: JSX.Element
  iconPosition?: "start" | "end"
}

const InputWithIconField = ({
  type,
  label,
  value,
  readOnly,
  onChange,
  inputRef,
  iconPosition = "start",
  iconComponent: IconComponent,
  ...rest
}: InputWithIconFieldProps & { readOnly?: boolean }) => {
  return (
    <InputField
      label={label}
      type={type}
      value={value}
      {...(onChange ? { onChange } : {})}
      {...(inputRef ? { inputRef } : {})}
      InputProps={{
        [iconPosition + "Adornment"]: (
          <InputAdornment position={iconPosition}>
            {IconComponent}
          </InputAdornment>
        ),
        readOnly: readOnly,
      }}
      {...rest}
    />
  )
}

export default InputWithIconField
