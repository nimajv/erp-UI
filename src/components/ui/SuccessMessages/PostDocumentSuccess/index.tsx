import React from "react"
import { CheckCircle } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Button from "../../../common/Button"
import { MySwal } from "../../../../utils/swal"

const PostDocumentSuccess = () => {
  const { t } = useTranslation()
  return (
    <div className="post-document-success">
      <CheckCircle className="post-document-success__icon" />
      <p>Your Documents has been posted!</p>
      <Button modifier="primary" onClick={() => MySwal.close()}>
        {t("common.close")}
      </Button>
    </div>
  )
}

export default PostDocumentSuccess
