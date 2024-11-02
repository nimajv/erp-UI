import React from "react"
import { Paper } from "@mui/material"

export function WithPaper<P>(BaseComponent: React.ComponentType<P>) {
  const PaperComponent = (
    props: P & { elevation?: number; className?: string | undefined },
  ) => {
    return (
      <Paper elevation={props.elevation || 3} className={props.className}>
        <BaseComponent {...props} />
      </Paper>
    )
  }

  return PaperComponent
}

export default WithPaper
