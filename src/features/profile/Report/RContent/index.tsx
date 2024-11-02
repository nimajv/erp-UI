import { useCallback, useEffect, useRef } from "react"
import { Pagination } from "@mui/material"
import { Formik, FormikProps, Form } from "formik"
import { useTranslation } from "react-i18next"

import {
  AutocompleteField,
  DatePickerField,
} from "../../../../components/common/Fields"

import {
  TableHeader,
  TableContent,
  Table,
} from "../../../../components/common/Table"

import {
  useAppDispatch,
  useAppSelector,
  usePaginatedFetcher,
} from "../../../../app/hooks"

import {
  selectCurrentDoc,
  selectDocs,
  selectRegisterForceUpdate,
  setCurrentDoc,
  toggleRegisterForceUpdate,
} from "../../documentSlice"

import {
  DocumentRow,
  DocumentRowLoader,
} from "../../../../components/ui/Tables/RegisterDocument"

import { headCells } from "../documentsHeadItems"
import Button from "../../../../components/common/Button"
import { filterDocumentsRequest } from "../../documentAPI"
import { IFilterData, Fetcher, RDContentValues } from "../../../../app/types"
import { FormikObserver } from "../../../../components/common/FormikObserver"

const RContent = () => {
  const toDateEl = useRef(null)
  const fromDateEl = useRef(null)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const docs = useAppSelector(selectDocs)
  const currentDoc = useAppSelector(selectCurrentDoc)
  const registerForceUpdate = useAppSelector(selectRegisterForceUpdate)

  const {
    fetchInitial,
    count,
    refresh,
    totalPage,
    handlePage,
    currentPage,
    itemsListCrop,
  } = usePaginatedFetcher<IFilterData, Fetcher<IFilterData>>(
    filterDocumentsRequest,
  )

  const changePage = useCallback(
    async (_event: React.ChangeEvent<unknown>, value: number) => {
      await handlePage(
        currentDoc.docId,
        currentDoc.fromDate,
        currentDoc.toDate,
        currentDoc.status,
      )(value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(currentDoc), handlePage],
  )

  useEffect(() => {
    fetchInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (registerForceUpdate) {
      setTimeout(() => {
        refresh(currentDoc.docId)
        // @ts-ignore
        fromDateEl.current!.clear()
        // @ts-ignore
        toDateEl.current!.clear()
        setCurrentDoc({ ...currentDoc, fromDate: "", toDate: "" })
      }, 500)
      dispatch(toggleRegisterForceUpdate())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, refresh, registerForceUpdate])

  return (
    <div className="register-document__content">
      <Formik
        initialValues={{
          fromDate: "",
          docId: "",
          toDate: "",
          status: "",
        }}
        onSubmit={async (values, actions) => {
          const { docId, fromDate, toDate } = values
          refresh(docId, fromDate, toDate)
          actions.setSubmitting(false)
        }}
      >
        {({ submitForm, values }: FormikProps<RDContentValues>) => (
          <>
            <Form noValidate>
              <div className="register-document__fields">
                <AutocompleteField
                  name="docId"
                  options={docs?.map((doc) => ({
                    id: doc.value,
                    value: doc.value + "- " + doc.text,
                  }))}
                  label={t("registerDocumentPage.content.documentInfo")}
                />
                <AutocompleteField
                  name="status"
                  options={[]}
                  label={t("registerDocumentPage.content.status")}
                />
                <DatePickerField
                  name="fromDate"
                  label={t("common.fromDate")}
                  ref={fromDateEl}
                />
                <DatePickerField
                  name="toDate"
                  label={t("common.toDate")}
                  ref={toDateEl}
                />
              </div>

              <div className="register-document__content-buttons">
                <Button
                  modifier="primary"
                  onClick={submitForm}
                  className="register-document__button register-document__button--state-search"
                >
                  {t("common.search")}
                </Button>
              </div>
            </Form>
            <FormikObserver
              value={values}
              onChange={(value) => dispatch(setCurrentDoc(value))}
            />
          </>
        )}
      </Formik>

      <Table sx={{ tableLayout: "auto" }}>
        <TableHeader<IFilterData> headCells={headCells} />
        <TableContent
          page={currentPage}
          rowsPerPage={10}
          itemsCount={count}
          Loader={DocumentRowLoader}
        >
          {itemsListCrop?.data?.map((row: IFilterData) => (
            <DocumentRow key={row?.id} row={row} />
          ))}
        </TableContent>
      </Table>

      {itemsListCrop?.data?.length! > 0 && (
        <Pagination
          variant="outlined"
          shape="rounded"
          count={totalPage}
          page={currentPage}
          onChange={changePage}
        />
      )}
    </div>
  )
}

export default RContent
