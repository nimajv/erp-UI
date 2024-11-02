import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from "@mui/material"
import React, { forwardRef } from "react"

type SelectFieldType = MuiSelectProps & {
  label?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string
  error?: string
  name: string
  options: OptionsItemType[]
  multiple?: boolean
  fullWidth?: boolean
}

export type OptionsItemType = {
  name: string
  value: string | number | OptionSortType | { path: string; order: string }
}

export type OptionSortType = {
  name: string
  value: {
    path: string
    order: string
  }
}

const SelectField: React.FC<SelectFieldType> = forwardRef(
  (
    {
      label,
      name,
      value,
      defaultValue,
      onChange,
      options,
      error,
      fullWidth = true,
      ...rest
    },
    ref,
  ) => {
    const optionsArray = options?.map((option) => ({
      name: option.name,
      value:
        typeof option.value === "object"
          ? JSON.stringify(option.value)
          : option.value,
    }))

    return (
      <FormControl
        variant="outlined"
        error={!!error}
        fullWidth={fullWidth}
        size="small"
      >
        <InputLabel>{label}</InputLabel>
        <MuiSelect
          inputRef={ref}
          label={label}
          // name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          {...rest}
        >
          {optionsArray?.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )
  },
)

export default React.memo(SelectField)
