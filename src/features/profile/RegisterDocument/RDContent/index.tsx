import { Box, Pagination } from "@mui/material"
import * as changeCase from "change-case"
import { Form, Formik, FormikProps } from "formik"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import "./index.scss"

import {
  AutocompleteField,
  DatePickerField,
} from "../../../../components/common/Fields"

import {
  Table,
  TableContent,
  TableHeader,
} from "../../../../components/common/Table"

import {
  useAppDispatch,
  useAppSelector,
  usePaginatedFetcher,
} from "../../../../app/hooks"

import {
  selectCurrentDoc,
  selectDocs,
  selectDocStates,
  selectRegisterForceUpdate,
  setCurrentDoc,
  toggleRegisterForceUpdate,
} from "../../documentSlice"

import {
  Fetcher,
  FilterState,
  FilterStates,
  IFilterData,
  RDContentValues,
} from "../../../../app/types"
import Button from "../../../../components/common/Button"
import { FormikObserver } from "../../../../components/common/FormikObserver"
import Icon from "../../../../components/common/Icon"
import {
  DocumentRow,
  DocumentRowLoader,
} from "../../../../components/ui/Tables/RegisterDocument"
import { FilterStatesKeys } from "../../../../utils/constants"
import { filterDocumentsRequest } from "../../documentAPI"
import { headCells } from "../documentsHeadItems"

const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From date is required"),
  toDate: Yup.date()
    .required("To date is required")
    .min(Yup.ref("fromDate"), "To date must be later than From date"),
  docId: Yup.string().required("Document ID is required"),
  status: Yup.string().required("Status is required"),
})

const RDContent = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const docs = useAppSelector(selectDocs)
  const docStates = useAppSelector(selectDocStates)
  const currentDoc = useAppSelector(selectCurrentDoc)
  const registerForceUpdate = useAppSelector(selectRegisterForceUpdate)

  const [hasFailedRecords, setHasFailedRecords] = useState(false)

  const {
    fetchInitial,
    count,
    refresh,
    totalPage,
    handlePage,
    currentPage,
    itemsListCrop,
    allData,
    error,
  } = usePaginatedFetcher<IFilterData, Fetcher<IFilterData>>(
    filterDocumentsRequest,
  )

  if (error) {
    throw new Error("Error When fetch Initial")
  }

  const changePage = useCallback(
    async (_event: React.ChangeEvent<unknown>, value: number) => {
      await handlePage(
        currentDoc.docId,
        currentDoc.fromDate,
        currentDoc.toDate,
        currentDoc.status,
      )(value)
    },
    [currentDoc, handlePage],
  )

  useEffect(() => {
    fetchInitial()
  }, [])

  useEffect(() => {
    if (registerForceUpdate) {
      setTimeout(() => {
        refresh(
          currentDoc.docId,
          currentDoc.fromDate,
          currentDoc.toDate,
          currentDoc.status,
        )
      }, 500)
      dispatch(toggleRegisterForceUpdate())
    }
  }, [dispatch, refresh, registerForceUpdate])

  useEffect(() => {
    if (allData) {
      const flattenedData = allData.flatMap((page) => page.data)
      const hasFailed = flattenedData.some(
        (row) => row.status === FilterStates["FAIL"],
      )
      setHasFailedRecords(hasFailed)
    }
  }, [allData])

  return (
    <div className="register-document__content">
      <Formik
        initialValues={{
          fromDate: "",
          docId: "",
          toDate: "",
          status: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          const { docId, fromDate, toDate, status } = values
          refresh(docId, fromDate, toDate, status)
          actions.setSubmitting(false)
        }}
      >
        {({
          submitForm,
          values,
          errors,
          touched,
        }: FormikProps<RDContentValues>) => (
          <>
            <Form>
              <div className="register-document__fields">
                <div className="register-document__field-group">
                  <AutocompleteField
                    name="docId"
                    options={docs?.map((doc) => ({
                      id: doc.value,
                      value: `${doc.value} - ${doc.text}`,
                    }))}
                    label={t("registerDocumentPage.content.documentInfo")}
                  />
                </div>
                <div className="register-document__field-group">
                  <AutocompleteField
                    name="status"
                    options={docStates?.map((s) => ({
                      id: String(s.code),
                      value: changeCase.capitalCase(s.name),
                    }))}
                    label={t("registerDocumentPage.content.status")}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > svg": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <Icon
                          size={30}
                          name={
                            FilterStatesKeys[
                              option.id as unknown as FilterState
                            ]
                          }
                        />
                        <span>{option.value}</span>
                      </Box>
                    )}
                  />
                </div>
                <div className="register-document__field-group">
                  <DatePickerField
                    name="fromDate"
                    label={t("common.fromDate")}
                  />
                </div>
                <div className="register-document__field-group">
                  <DatePickerField name="toDate" label={t("common.toDate")} />
                </div>
              </div>

              <div className="register-document__content-buttons">
                <Button
                  modifier="primary"
                  onClick={submitForm}
                  className="register-document__button register-document__button--state-search"
                >
                  {t("common.search")}
                </Button>
                {hasFailedRecords && (
                  <span style={{ color: "red", marginLeft: "30px" }}>
                    {t("YOU HAVE FAIL RECORD")}
                  </span>
                )}
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

export default RDContent
