import React, { useLayoutEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import {
  getCompanies,
  selectGetCompaniesLoading,
} from "../../../../features/general/companySlice"
import { selectCompany } from "../../../../features/general/generalSlice"
import {
  getDocumentStates,
  getDocuments,
} from "../../../../features/profile/documentSlice"

const DashboardLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const company = useAppSelector(selectCompany)
  const GetCompaniesLoading = useAppSelector(selectGetCompaniesLoading)

  useLayoutEffect(() => {
    dispatch(getCompanies())
    dispatch(getDocumentStates())

    if (company?.length !== 0) {
      dispatch(getDocuments())
    }
  }, [dispatch, company])

  if (!GetCompaniesLoading) {
    return children
  } else {
    return <></>
  }
}

export default DashboardLoader
