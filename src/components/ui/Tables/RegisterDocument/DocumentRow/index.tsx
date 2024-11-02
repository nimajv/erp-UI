import { Checkbox } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import { AxiosResponse } from "axios"
import * as changeCase from "change-case"
import moment from "moment"
import * as React from "react"
import { axiosClient } from "../../../../../app/axiosClient"
import { ApiError } from "../../../../../app/types"
import {
  RDItem,
  addToRegisteredDocs,
  removeFromRegisteredDocs,
  selectRegisteredDocs,
} from "../../../../../features/profile/documentSlice"
import Button from "../../../../common/Button"

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { FilterStates, IFilterData } from "../../../../../app/types"
import { FilterStatesKeys } from "../../../../../utils/constants"
import Icon from "../../../../common/Icon"
import Tooltip from "../../../../common/Tooltip"

interface DocumentRowProps {
  row: IFilterData
}

const DocumentRow = ({ row }: DocumentRowProps) => {
  const [isModalOpen, setModalOpen] = React.useState(false)
  const dispath = useAppDispatch()
  const isPosted = row.status === FilterStates["POSTED"]
  const forbiddenStatuses = [
    FilterStates["SUCCESS"],
    FilterStates["PARTIAL_SUCCESS"],
    FilterStates["PARTIAL_POSTING"],
    FilterStates["PARTIAL_FAIL"],
  ]

  const isForbiddenRow = !forbiddenStatuses.includes(row.status)

  const registeredDocs: RDItem[] = useAppSelector(selectRegisteredDocs)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const { checked } = event.target

    if (checked) {
      dispath(addToRegisteredDocs({ id, isIfrs: row.isIfrs }))
    } else {
      dispath(removeFromRegisteredDocs(id))
    }
  }

  const downloadDetailFile = async (
    docId: string,
  ): Promise<AxiosResponse<any, ApiError>> => {
    return axiosClient({
      url: `/bookingDetails/${docId}`,
      method: "GET",
      responseType: "blob",
    })
  }

  const registeredState = React.useMemo(() => {
    return registeredDocs.find((item) => item.id === row.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(registeredDocs), row.id])

  const getBookingDetailsFile = () => {
    console.log(row.id)
    if (row.id) {
      downloadDetailFile(row.id).then((res: any) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `booking-detail-${row.id}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      })
    }
  }
  return (
    <>
      <TableRow
        key={row.id}
        hover={true}
        className={`table-row ${
          isPosted
            ? "table-row--state-primary"
            : isForbiddenRow
            ? "table-row--state-disabled"
            : ""
        }`}
      >
        <TableCell component="th" scope="row" align="center">
          <Checkbox
            disabled={isPosted || isForbiddenRow}
            onChange={(e) => handleChange(e, row.id)}
            inputProps={{ "aria-label": "controlled" }}
            checked={!!registeredState?.id || isPosted || isForbiddenRow}
          />
        </TableCell>
        <TableCell align="center">{row.docId}</TableCell>
        <TableCell align="center">{row.transactionType}</TableCell>
        <TableCell align="center">
          {moment(row.creatE_DATE).format("YYYY-MM-DD HH:mm:ss")}
        </TableCell>
        <TableCell align="center">
          {row.start_date.split("T")[0]} To {row.end_date.split("T")[0]}
        </TableCell>
        <TableCell
          align="center"
          onClick={() => {
            if (!row.amount) return
            setModalOpen(true)
          }}
        >
          {row.amount ? new Intl.NumberFormat("fa-IR").format(row.amount) : "۰"}
        </TableCell>
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.rowDocumentCount}</TableCell>
        <TableCell align="center">
          <Tooltip
            placement="top"
            modifier="info"
            title={changeCase.capitalCase(FilterStates[row?.status])}
          >
            <Button variant="text" modifier="reset">
              <Icon size={35} name={FilterStatesKeys[row.status]} />
            </Button>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Dialog
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Download detail logs file
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to see the detail logs?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setModalOpen(false)}>
            No
          </Button>
          <Button
            onClick={() => {
              setModalOpen(false)
              getBookingDetailsFile()
            }}
            autoFocus
            variant="text"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DocumentRow
