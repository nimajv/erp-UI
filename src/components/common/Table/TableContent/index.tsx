import React from "react"
import {
  TableBody as MuiTableBody,
  TableCell,
  TableRow,
  TableBodyProps as MuiTableBodyProps,
} from "@mui/material"

type TableBodyProps = MuiTableBodyProps & {
  itemsCount: number
  page?: number
  rowsPerPage?: number
  Loader: () => JSX.Element
}

const TableContent: React.FC<TableBodyProps> = ({
  itemsCount,
  page = 1,
  rowsPerPage = 10,
  children,
  Loader,
}) => {
  const emptyRows =
    page * rowsPerPage > itemsCount ? 10 - (itemsCount % rowsPerPage) : 0

  return (
    <MuiTableBody>
      {itemsCount === 0 && (children as React.ReactNode[])?.length === 0 && (
        <TableRow>
          <TableCell colSpan={20}>no records found</TableCell>
        </TableRow>
      )}

      {!children
        ? [...Array(rowsPerPage)].map((_row, index) => <Loader key={index} />)
        : children}

      {emptyRows > 0 && (
        <TableRow
          sx={{
            height: `${78 * emptyRows}px`,
          }}
        >
          <TableCell colSpan={20} />
        </TableRow>
      )}
    </MuiTableBody>
  )
}

export default TableContent
