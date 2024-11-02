import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import {
  clearRegisteredDocs,
  selectCurrentDoc,
  selectRegisteredDocs,
  toggleRegisterForceUpdate,
} from "../../documentSlice"
import { MySwal } from "../../../../utils/swal"
import Button from "../../../../components/common/Button"
import {
  postDocumentRequest,
  retryDocumentRequest,
  sendDocumentRequest,
} from "../../documentAPI"
import { PostDocumentSuccess } from "../../../../components/ui/SuccessMessages"
import { loadingAlert } from "../../../../data/alerts"
import { PostDocumentFail } from "../../../../components/ui/FailMessages"
import { IErrorRes } from "../../../../app/types"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { selectCompany } from "../../../general/generalSlice"
import { selectUser } from "../../../auth/authSlice"

const RDFooter = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const company = useAppSelector(selectCompany)
  const currentDoc = useAppSelector(selectCurrentDoc)
  const registeredDocs = useAppSelector(selectRegisteredDocs)

  const sendDocument = async () => {
    if (currentDoc.docId) {
      sendDocumentRequest({
        snappGroup: company,
        docId: +currentDoc.docId,
        startDate: currentDoc.fromDate,
        endDate: currentDoc.toDate,
        isPosting: false,
        isDeleting: false,
        isPartialSuccess: false,
        userName: user.username,
        typeRun: 0,
      }).finally(() => {
        dispatch(toggleRegisterForceUpdate())
      })
    } else {
      toast.error("Document Info is not set!")
    }
  }

  const postDocument = async () => {
    if (currentDoc.fromDate?.length === 0 || currentDoc.toDate?.length === 0) {
      return toast.error("From Date or To Date is not set")
    }

    if (registeredDocs.length === 0) {
      return toast.error("There is no document to post.")
    }

    MySwal.fire(loadingAlert)

    await Promise.allSettled(
      registeredDocs?.map(async (rDoc) => {
        const res = await postDocumentRequest({
          id: rDoc.id,
          isIfrs: rDoc.isIfrs,
          startDate: currentDoc.fromDate,
          endDate: currentDoc.toDate,
        })

        return res
      }),
    ).then((result) => {
      dispatch(clearRegisteredDocs())

      const isRejected = <T,>(
        p: PromiseSettledResult<T>,
      ): p is PromiseRejectedResult => p.status === "rejected"

      const rejectedArr = result.filter(isRejected)
      if (rejectedArr.length === 0) {
        MySwal.fire({
          html: <PostDocumentSuccess />,
          heightAuto: false,
          showCloseButton: true,
          showConfirmButton: false,
        })
      } else {
        const errors = rejectedArr.map(
          (req) => req?.reason?.response?.data as IErrorRes,
        )

        MySwal.fire({
          icon: "error",
          heightAuto: false,
          showCloseButton: true,
          showConfirmButton: false,
          html: <PostDocumentFail errors={errors} />,
        })
      }

      dispatch(toggleRegisterForceUpdate())
    })
  }

  // Retry function for registered documents
  const retryDocuments = () => {
    const docCount = registeredDocs.length

    if (docCount !== 0) {
      MySwal.fire({
        showCloseButton: true,
        heightAuto: false,
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes",
        title:
          docCount === 1
            ? "Are you sure you want to retry this item?"
            : "Are you sure you want to retry these items?",
        customClass: {
          container: "delete-document-modal",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Promise.all(
            registeredDocs.map((doc) =>
              retryDocumentRequest({
                company, // Use dynamic company name here
                docId: doc.id, // Ensure this is defined
              }),
            ),
          )
            .then(() => {
              toast.success("Documents retried successfully!")
              dispatch(toggleRegisterForceUpdate())
            })
            .catch((error) => {
              toast.error("Error while retrying documents.")
              console.error(error)
            })
        }
      })
    } else {
      toast.error("There are no documents to retry.")
    }
  }
  return (
    <div className="document-footer">
      <div className="register-document__footer">
        <Button modifier="light" onClick={sendDocument}>
          {t("common.send")}
        </Button>
        <Button onClick={postDocument}>{t("common.post")}</Button>

        {/* Retry Button */}
        <Button modifier="secondary" onClick={retryDocuments}>
          {t("Retry")}
        </Button>
      </div>
    </div>
  )
}

export default RDFooter
