import { useCallback, useEffect } from "react"
import { Box, Pagination } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Formik, FormikProps, Form } from "formik"
import * as changeCase from "change-case"

import {
  useAppDispatch,
  useAppSelector,
  usePaginatedFetcher,
} from "../../../../app/hooks"

import {
  selectCurrentDoc,
  selectDeleteForceUpdate,
  selectDocStates,
  selectDocs,
  setCurrentDoc,
  toggleDeleteForceUpdate,
} from "../../documentSlice"

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
  DocumentRow,
  DocumentRowLoader,
} from "../../../../components/ui/Tables/DeleteDocument"

import { headCells } from "../documentsHeadItems"
import Button from "../../../../components/common/Button"
import { filterDocumentsRequest } from "../../documentAPI"
import {
  IFilterData,
  Fetcher,
  RDContentValues,
  FilterState,
} from "../../../../app/types"
import { FormikObserver } from "../../../../components/common/FormikObserver"
import Icon from "../../../../components/common/Icon"
import { FilterStatesKeys } from "../../../../utils/constants"

const RDContent = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const docs = useAppSelector(selectDocs)
  const docStates = useAppSelector(selectDocStates)
  const currentDoc = useAppSelector(selectCurrentDoc)
  const deleteForceUpdate = useAppSelector(selectDeleteForceUpdate)

  const {
    fetchInitial,
    count,
    refresh,
    totalPage,
    handlePage,
    currentPage,
    itemsListCrop,
    error,
  } = usePaginatedFetcher<IFilterData, Fetcher<IFilterData>>(
    filterDocumentsRequest,
    { forDelete: true },
  )

  if (error) {
    throw new Error("Error when fetching initial data")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(currentDoc), handlePage],
  )

  useEffect(() => {
    fetchInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (deleteForceUpdate) {
      setTimeout(() => {
        refresh(
          currentDoc.docId,
          currentDoc.fromDate,
          currentDoc.toDate,
          currentDoc.status,
        )
      }, 500)
      dispatch(toggleDeleteForceUpdate())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, refresh, deleteForceUpdate])

  return (
    <div className="delete-document__content">
      <Formik
        initialValues={{
          docId: "",
          toDate: "",
          status: "",
          fromDate: "",
        }}
        onSubmit={async (values, actions) => {
          const { docId, fromDate, toDate, status } = values
          refresh(docId, fromDate, toDate, status)
          actions.setSubmitting(false)
        }}
      >
        {({ submitForm, values }: FormikProps<RDContentValues>) => (
          <>
            <Form noValidate>
              <div className="delete-document__fields">
                <AutocompleteField
                  name="docId"
                  options={docs?.map((doc) => ({
                    id: doc.value,
                    value: doc.value + "- " + doc.text,
                  }))}
                  label={t("deleteDocumentPage.content.documentInfo")}
                />
                <AutocompleteField
                  name="status"
                  options={docStates.map((s) => ({
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
                          FilterStatesKeys[option.id as unknown as FilterState]
                        }
                      />
                      <span>{option.value}</span>
                    </Box>
                  )}
                />
                <DatePickerField name="fromDate" label={t("common.fromDate")} />
                <DatePickerField name="toDate" label={t("common.toDate")} />
              </div>

              <div className="delete-document__content-buttons">
                <Button
                  modifier="primary"
                  onClick={submitForm}
                  className="delete-document__button delete-document__button--state-search"
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
          {itemsListCrop?.data?.map((row: IFilterData) => {
            return <DocumentRow key={row?.id} row={{ ...row }} />
          })}
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
