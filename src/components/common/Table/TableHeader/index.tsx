import {
  TableCell,
  TableHead,
  TableRow,
  TableHeadProps as MuiTableHeaderProps,
} from "@mui/material"

export type TableHeadCell<T> = {
  id: keyof T
  label: string
}

type TableHeaderProps<T> = MuiTableHeaderProps & {
  headCells: Array<TableHeadCell<T>>
}

function TableHeader<T>({ headCells, ...rest }: TableHeaderProps<T>) {
  return (
    <TableHead sx={{ backgroundColor: "#F6F6F6" }} {...rest}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={String(headCell.id)} align={"center"}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default TableHeader
