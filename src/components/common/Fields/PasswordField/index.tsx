import { useState } from "react"
import { TextFieldProps as MuiTextFieldProps } from "@mui/material"

import { InputWithIconField } from ".."
import { Visibility, VisibilityOff } from "@mui/icons-material"

import { IconButton } from "@mui/material"

type PasswordFieldProps = MuiTextFieldProps & {
  label: string
}

const PasswordField = ({ label, ...rest }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const IconComponent = () => {
    return (
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    )
  }

  return (
    <InputWithIconField
      label={label}
      iconPosition="end"
      iconComponent={<IconComponent />}
      type={showPassword ? "text" : "password"}
      {...rest}
    />
  )
}

export default PasswordField
