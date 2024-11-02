import * as React from "react"
import {
  Table as MuiTable,
  TableContainer,
  TableProps,
  Paper,
} from "@mui/material"

export default function Table({ children }: TableProps) {
  return (
    <TableContainer component={Paper}>
      <MuiTable sx={{ minWidth: 650 }}>{children}</MuiTable>
    </TableContainer>
  )
}
