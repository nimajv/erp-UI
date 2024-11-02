import { useCallback, useLayoutEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import {
  selectCompany,
  changeCompany,
} from "../../../../../features/general/generalSlice"
import { MySwal } from "../../../../../utils/swal"
import ChooseCompanyContent from "./content"
import { selectCompanies } from "../../../../../features/general/companySlice"

const ChooseCompany = () => {
  const dispatch = useAppDispatch()
  const company = useAppSelector(selectCompany)
  const companies = useAppSelector(selectCompanies)

  const onChooseComany = useCallback(
    (company: string) => {
      dispatch(changeCompany(company))
    },
    [dispatch],
  )

  useLayoutEffect(() => {
    if (company.length === 0 && companies.length > 0) {
      MySwal.fire({
        html: (
          <ChooseCompanyContent
            onChoose={onChooseComany}
            items={companies?.map((company) => company.value)}
          />
        ),
        heightAuto: false,
        showCloseButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: "choose-company__popup",
          container: "choose-company__container",
        },
      })
    }
  }, [companies, company, onChooseComany])

  return null
}

export default ChooseCompany
