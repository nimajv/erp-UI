import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import RDContent from "./RDContent"
import RDFooter from "./RDFooter"
import SnappCard from "../../../components/common/SnappCard"
import Container from "../../../components/common/Container"
import { useAppDispatch } from "../../../app/hooks"
import { clearDocsForDelete, setCurrentDoc } from "../documentSlice"
import WithErrorBoundary from "../../../components/common/WithErrorBoundary"

const DeleteDocument = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      dispatch(clearDocsForDelete())
      dispatch(
        setCurrentDoc({ docId: "", fromDate: "", toDate: "", status: "" }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container className="delete-document">
      <SnappCard>
        <SnappCard.Header>{t("deleteDocumentPage.header")}</SnappCard.Header>
        <SnappCard.Body>
          <RDContent />
        </SnappCard.Body>
        <SnappCard.Footer>
          <RDFooter />
        </SnappCard.Footer>
      </SnappCard>
    </Container>
  )
}

export default WithErrorBoundary(DeleteDocument)
