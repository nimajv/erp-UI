import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "../../../app/hooks"
import Container from "../../../components/common/Container"
import SnappCard from "../../../components/common/SnappCard"
import WithErrorBoundary from "../../../components/common/WithErrorBoundary"
import { clearRegisteredDocs, setCurrentDoc } from "../documentSlice"
import RDContent from "./RDContent"
import RDFooter from "./RDFooter"

const RegisterDocument = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    return () => {
      dispatch(clearRegisteredDocs())
      dispatch(
        setCurrentDoc({ docId: "", fromDate: "", toDate: "", status: "" }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container className="register-document">
      <SnappCard>
        <SnappCard.Header>{t("registerDocumentPage.header")}</SnappCard.Header>
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

export default WithErrorBoundary(RegisterDocument)
