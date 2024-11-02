import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material"
import { useFormikContext } from "formik"

interface MyAutocomplete<
  T extends { id: string; value: string },
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    "renderInput"
  > {
  label?: string
  name: string
}

const AutocompleteField = <
  T extends { id: string; value: string },
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  options,
  label,
  name,
  ...rest
}: MyAutocomplete<T, Multiple, DisableClearable, FreeSolo>) => {
  const defaultValue = { id: "", value: "show all" }
  const { touched, errors, setFieldValue } = useFormikContext<any>()
  return (
    <Autocomplete
      {...rest}
      size="small"
      includeInputInList
      defaultValue={defaultValue as any}
      options={[defaultValue as T, ...options]}
      getOptionLabel={(option) => (option as T).value}
      onChange={(e, value) => setFieldValue(name, (value as T)?.id || "")}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          fullWidth
          name={name}
          label={label}
          variant="outlined"
          helperText={touched[name] && (errors.option as string)}
          error={Boolean(touched[name] && (errors.option as string))}
        />
      )}
    />
  )
}

export default AutocompleteField
