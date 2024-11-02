import React from "react"
import { Add } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import WithPaper from "../../../../common/WithPaper"

const AddService = () => {
  const { t } = useTranslation()

  return (
    <div className="add-service__content">
      <div className="add-service__icon">
        <Add />
      </div>
      <p className="add-service__title">{t("profileHomePage.addFav")}</p>
    </div>
  )
}

const AddServicePaper = WithPaper(AddService)({
  className: "add-service",
})
export default AddServicePaper
