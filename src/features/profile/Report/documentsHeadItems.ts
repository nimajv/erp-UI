import { IFilterData } from "../../../app/types"
import { TableHeadCell } from "../../../components/common/Table/TableHeader"

export const headCells: TableHeadCell<
  IFilterData & { date?: string; checked?: boolean }
>[] = [
  {
    id: "checked",
    label: "",
  },
  {
    id: "docId",
    label: "Transaction ID",
  },
  {
    id: "transactionType",
    label: "Transaction Type",
  },
  {
    id: "creatE_DATE",
    label: "Creation Date",
  },
  {
    id: "date",
    label: "Posting Date",
  },
  {
    id: "amount",
    label: "Amount",
  },
  {
    id: "id",
    label: "Document Number",
  },
  {
    id: "rowDocumentCount",
    label: "Document Count",
  },
  {
    id: "status",
    label: "State",
  },
]
