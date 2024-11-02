import { useCallback, useRef, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import ListComponent from "../../../../common/List"
import { MySwal } from "../../../../../utils/swal"

const ChooseCompanyContent = ({
  items,
  onChoose,
}: {
  items: string[]
  onChoose: (company: string) => void
}) => {
  const { t } = useTranslation()
  const companyRef = useRef("")
  const buttonRef = useRef<HTMLInputElement>(null)

  const onSet = (company: string) => {
    companyRef.current = company
    buttonRef.current!.removeAttribute("disabled")
  }

  const onChooseCompany = useCallback(() => {
    onChoose(companyRef.current)
    MySwal.close()
  }, [onChoose])

  useLayoutEffect(() => {
    buttonRef.current!.setAttribute("disabled", "")
  }, [])

  return (
    <div>
      <ListComponent
        onSet={onSet}
        items={items}
        title={t("profileHomePage.selectCompany")}
      />

      <input
        ref={buttonRef}
        type="button"
        value={t("common.login")}
        className="change-company-btn"
        onClick={onChooseCompany}
      />
    </div>
  )
}

export default ChooseCompanyContent
