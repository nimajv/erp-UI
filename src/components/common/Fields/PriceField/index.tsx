import React from "react"
import { useFormikContext } from "formik"
import { NumericFormat } from "react-number-format"
import { InputField } from ".."

type PriceInputProps = {
  label: string
  name: string
  value: string
}

const PriceInput = ({ name, label, value }: PriceInputProps) => {
  const { setFieldValue } = useFormikContext()
  return (
    <NumericFormat
      value={value}
      prefix="R "
      thousandSeparator
      customInput={InputField}
      label={label}
      name={name}
      onValueChange={(val: { floatValue: any }) =>
        setFieldValue(name, val.floatValue)
      }
    />
  )
}

export default PriceInput

// eslint-disable-next-line no-lone-blocks
{
  /* <PriceField
                  label={t("common.amount")}
                  name="amount"
                  value={values.amount}
                /> */
}
