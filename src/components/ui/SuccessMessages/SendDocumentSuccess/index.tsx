import React from "react"
import { AxiosResponse } from "axios"
import { CheckCircle } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Button from "../../../common/Button"
import { MySwal } from "../../../../utils/swal"

const SendDocumentSuccess = (props: AxiosResponse) => {
  const { t } = useTranslation()
  return (
    <div className="send-document-success">
      <CheckCircle className="send-document-success__icon" />
      <p>Log Number is:</p>
      <p className="send-document-success__log-number">
        {props.data?.data?.documentLogId || ""}
      </p>
      <Button modifier="primary" onClick={() => MySwal.close()}>
        {t("common.close")}
      </Button>
    </div>
  )
}

export default SendDocumentSuccess
