import { Box } from "@mui/material"

interface ReportItemProps {
  children?: React.ReactNode
  index: number
  value: number
}

const ReportItem = (props: ReportItemProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default ReportItem
