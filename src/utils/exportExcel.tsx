import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

const exportToExcel = (data: any[], name = "data.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  // Buffer to store the generated Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  })

  saveAs(blob, name)
}

export default exportToExcel
