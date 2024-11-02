import * as React from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@mui/material/styles"
import { Box, Tab, Tabs, useMediaQuery } from "@mui/material"
import { ExpandMore, KeyboardArrowRight } from "@mui/icons-material"

import RContent from "./RContent"
import ReportItem from "./ReportItem"
import Button from "../../../components/common/Button"
import SnappCard from "../../../components/common/SnappCard"
import Container from "../../../components/common/Container"

const a11yProps = (index: number) => {
  return {
    id: `report-tab-${index}`,
    "aria-controls": `report-tabpanel-${index}`,
  }
}

const Report = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const [value, setValue] = React.useState(0)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"))

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Container>
      <Box className="report" flexDirection={isSmallScreen ? "column" : "row"}>
        <Box className="report__tabs">
          <SnappCard>
            <SnappCard.Header>Report</SnappCard.Header>
            <SnappCard.Body>
              <Tabs
                value={value}
                aria-label="report"
                onChange={handleChange}
                TabIndicatorProps={{
                  style: { display: "none" },
                }}
                orientation={isSmallScreen ? "horizontal" : "vertical"}
              >
                {Array.from(Array(200).keys())?.map((val) => (
                  <Tab
                    key={val}
                    label={"Item " + val}
                    disableRipple
                    {...a11yProps(val)}
                    icon={
                      isSmallScreen ? (
                        <></>
                      ) : value !== val ? (
                        <ExpandMore />
                      ) : (
                        <KeyboardArrowRight />
                      )
                    }
                    iconPosition="end"
                  />
                ))}
              </Tabs>
            </SnappCard.Body>
          </SnappCard>
        </Box>

        <Box className="report__items">
          <SnappCard>
            <SnappCard.Header>Report</SnappCard.Header>
            <SnappCard.Body>
              {Array.from(Array(200).keys())?.map((val) => (
                <ReportItem value={value} index={val} key={val}>
                  <RContent />
                </ReportItem>
              ))}
            </SnappCard.Body>
            <SnappCard.Footer>
              <Button modifier="primary" onClick={() => {}}>
                {t("common.download") + " " + t("common.excel")}
              </Button>
            </SnappCard.Footer>
          </SnappCard>
        </Box>
      </Box>
    </Container>
  )
}

export default Report
