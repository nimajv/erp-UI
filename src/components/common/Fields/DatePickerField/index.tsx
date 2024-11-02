/* eslint-disable no-useless-escape */
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useField, useFormikContext } from "formik"
import DatePicker, { toDateObject } from "react-multi-date-picker"
import type { DateObject, Value } from "react-multi-date-picker"
import { CalendarMonth, ChangeCircleOutlined } from "@mui/icons-material"

import { InputWithIconField } from ".."
import constants from "../../../../utils/constants"
import { toEnDigit } from "../../../../utils/functions"

type DatePickerFieldProps = {
  label: string
  name: string
}

const DatePickerField = forwardRef(
  ({ label, name, ...rest }: DatePickerFieldProps, ref) => {
    const [field] = useField(name)
    const inputRef = useRef<HTMLInputElement>(null)
    const [lang, setLang] = useState<"fa" | "en">("en")
    const { setFieldValue, setFieldTouched } = useFormikContext()

    const changeLang = useCallback(() => {
      setLang((prevLang) => (prevLang === "fa" ? "en" : "fa"))
    }, [])

    const handleBlurSpecial = () => {
      setFieldTouched(name, true, false)
    }

    const updateDate = (newDate: DateObject) => {
      if (!newDate) {
        setFieldValue(name, "", false)
        return false
      }

      const date = newDate?.toDate()
      date?.setHours(0, 0, 0, 0)

      return setFieldValue(
        name,
        toDateObject(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        false,
      )
    }

    useImperativeHandle(
      ref,
      () => {
        return {
          clear() {
            setFieldValue(name, "")
          },
        }
      },
      [name, setFieldValue],
    )

    const changeDate = (
      newDate: DateObject,
      { isTyping }: { isTyping: boolean },
    ) => {
      if (isTyping) {
        const inputValue = inputRef.current?.value!
        if (
          /[a-zA-Z._!"`'#%&,:;<>=@{}~\$\(\)\*\+\\\?\[\]\^\|]/.test(inputValue)
        ) {
          return false
        }

        const strings = toEnDigit(inputValue).match(/\d+/g)
        if (strings?.length) {
          const numbers = strings.map(Number)
          const [, month, day] = numbers

          if (
            day < 0 ||
            month < 0 ||
            month > 12 ||
            (newDate && day > newDate.day) ||
            strings.some((val) => val.startsWith("00")) ||
            (inputValue && numbers.some((number) => isNaN(number)))
          ) {
            return false
          } else {
            updateDate(newDate)
          }
        } else {
          updateDate(newDate)
        }
      } else {
        updateDate(newDate)
      }
    }

    return (
      <div className={`date-picker date-picker--state-${lang}`}>
        <DatePicker
          {...rest}
          {...field}
          onChange={changeDate}
          locale={constants.CALENDAR_LANGS[lang].locale}
          calendar={constants.CALENDAR_LANGS[lang].calendar}
          render={(value: Value, onFocus, onChange) => {
            return (
              <InputWithIconField
                name={name}
                label={label}
                onFocus={onFocus}
                inputRef={inputRef}
                onChange={onChange}
                iconPosition="start"
                value={value?.toString()}
                onBlur={handleBlurSpecial}
                iconComponent={<CalendarMonth />}
                InputLabelProps={{ shrink: true }}
                className={`date-picker__input date-picker__input--state-${lang}`}
              />
            )
          }}
        />

        <div className="date-picker__icon" onClick={changeLang}>
          <ChangeCircleOutlined />
        </div>
      </div>
    )
  },
)

export default memo(DatePickerField)
