import React from "react"
import { TableRow, TableCell, Skeleton } from "@mui/material"

const DocumentRowLoader = () => {
  return (
    <TableRow sx={{ height: 75 }}>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
    </TableRow>
  )
}

export default DocumentRowLoader
