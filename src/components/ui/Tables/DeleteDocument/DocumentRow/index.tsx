import moment from "moment"
import { useRef } from "react"
import * as changeCase from "change-case"
import { TableRow, TableCell, Checkbox, SelectChangeEvent } from "@mui/material"

import {
  addToDocsDelete,
  addToDocsForDelete,
  changeDocForDelete,
  removeFromDocsForDelete,
  selectDocsForDelete,
} from "../../../../../features/profile/documentSlice"
import Icon from "../../../../common/Icon"
import Button from "../../../../common/Button"
import Tooltip from "../../../../common/Tooltip"
import { SelectField } from "../../../../common/Fields"
import { FilterStatesKeys } from "../../../../../utils/constants"
import { FilterStates, IFilterData } from "../../../../../app/types"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"

interface DocumentRowProps {
  row: IFilterData // Ensure company is part of the row type
}

const DocumentRow = ({ row }: DocumentRowProps) => {
  const dispatch = useAppDispatch()
  const deleteTypeRef = useRef<HTMLInputElement>(null)
  const isPosted = row.status === FilterStates["POSTED"]
  const docsForDelete = useAppSelector(selectDocsForDelete)

  const toggleDocumentForDelete = (
    e: React.ChangeEvent<HTMLInputElement>,
    logId: string,
  ) => {
    if (e.target.checked) {
      if (deleteTypeRef.current!.value === "0") {
        dispatch(addToDocsForDelete(logId, row.isIfrs)) // Use company here
      } else {
        dispatch(
          addToDocsDelete({
            id: logId,
            deletestrategyEnum: +deleteTypeRef.current!.value,
            isIfrs: row.isIfrs,
          }),
        )
      }
    } else {
      dispatch(removeFromDocsForDelete(logId))
    }
  }

  const changeDocDeleteItem = (e: SelectChangeEvent<any>, logId: string) => {
    if (docsForDelete.find((item) => item.id === row.id)) {
      dispatch(
        changeDocForDelete({
          id: logId,
          deletestrategyEnum: e.target.value,
          isIfrs: row.isIfrs,
        }),
      )
    } else {
      dispatch(
        addToDocsDelete({
          id: logId,
          deletestrategyEnum: e.target.value,
          isIfrs: row.isIfrs,
        }),
      )
    }
  }

  return (
    <TableRow
      hover={true}
      key={row.id}
      className={`table-row ${isPosted ? "table-row--state-primary" : ""}`}
    >
      <TableCell align="center">
        <Checkbox
          //   disabled={isPosted}
          inputProps={{ "aria-label": "controlled" }}
          onChange={(e) => toggleDocumentForDelete(e, row.id)}
          checked={
            !!docsForDelete.find((item) => item.id === row.id) ||
            row?.status === FilterStates["POSTED"]
          }
        />
      </TableCell>
      <TableCell align="center">{row.transactionType}</TableCell>
      <TableCell align="center">{row.docId}</TableCell>
      <TableCell align="center">
        {moment(row.creatE_DATE).format("YYYY-MM-DD HH:mm:ss")}
      </TableCell>
      <TableCell align="center">
        {row.start_date.split("T")[0]} To {row.end_date.split("T")[0]}
      </TableCell>
      <TableCell align="center">
        {new Intl.NumberFormat("fa-IR").format(row.amount)}
      </TableCell>
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="center">{row.rowDocumentCount}</TableCell>
      <TableCell align="center">
        <Tooltip
          placement="top"
          modifier="info"
          title={changeCase.capitalCase(FilterStates[row.status])}
        >
          <Button variant="text" modifier="reset">
            <Icon size={35} name={FilterStatesKeys[row.status]} />
          </Button>
        </Tooltip>
      </TableCell>
      <TableCell>
        <SelectField
          options={[
            { name: "Both", value: 0 },
            { name: "ERP", value: 1 },
            { name: "DB", value: 2 },
          ]}
          name={"deleteType"}
          ref={deleteTypeRef}
          onChange={(e) => changeDocDeleteItem(e, row.id)}
          defaultValue={"0"}
          //   disabled={isPosted}
        />
      </TableCell>
    </TableRow>
  )
}

export default DocumentRow
