import {
  TablePagination as MuiPagination,
  TablePaginationProps as MuiPaginationProps,
} from "@mui/material"
import React from "react"

const Pagination: React.FC<MuiPaginationProps> = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  ...rest
}) => {
  return (
    <div className="pagination">
      <MuiPagination
        page={page}
        component="div"
        count={count}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        {...rest}
      />
    </div>
  )
}

export default Pagination
