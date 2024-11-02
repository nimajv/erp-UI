import React from "react"
import { AxiosResponse } from "axios"
import { CheckCircle } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Button from "../../../common/Button"
import { MySwal } from "../../../../utils/swal"

const DeleteDocumentSuccess = (props: AxiosResponse) => {
  const { t } = useTranslation()
  return (
    <div className="delete-document-success">
      <CheckCircle className="delete-document-success__icon" />
      <p className="delete-document-success__text">
        Your Docs has been deleted.
      </p>
      <Button modifier="primary" onClick={() => MySwal.close()}>
        {t("common.close")}
      </Button>
    </div>
  )
}

export default DeleteDocumentSuccess
