import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

import {
  clearDocsForDelete,
  selectCurrentDoc,
  selectDocsForDelete,
  toggleDeleteForceUpdate,
} from "../../documentSlice"
import { MySwal } from "../../../../utils/swal"
import Button from "../../../../components/common/Button"
import { deleteDocumentRequest } from "../../documentAPI"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"

const RDFooter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const docsForDelete = useAppSelector(selectDocsForDelete)
  const currentDoc = useAppSelector(selectCurrentDoc)
  // Get the company name from the Redux store

  const deleteDocument = () => {
    if (docsForDelete?.length !== 0) {
      MySwal.fire({
        showCloseButton: true,
        heightAuto: false,
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes",
        title: "Are you sure to delete this item?",
        customClass: {
          container: "delete-document-modal",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          deleteDocumentRequest({
            deteteDetails: docsForDelete?.map((doc) => ({
              ...doc,
              ...(currentDoc?.fromDate.length > 0 && {
                startDate: currentDoc.fromDate,
              }),
              ...(currentDoc?.toDate.length > 0 && {
                toDate: currentDoc.toDate,
              }),
            })),
          })
            .then(() => {
              dispatch(clearDocsForDelete())
              dispatch(toggleDeleteForceUpdate())
            })
            .catch((err) => {
              dispatch(clearDocsForDelete())
              throw err
            })
        }
      })
    } else {
      toast.error("There are no documents to delete.")
    }
  }

  return (
    <div className="delete-document__footer">
      <Button modifier="primary" onClick={deleteDocument}>
        {t("common.delete")}
      </Button>
    </div>
  )
}

export default RDFooter
