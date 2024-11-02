import React from "react"
import { Helmet } from "react-helmet"

interface IProps {
  component: React.FC
  title: string
}

const RouteWithTitle = ({ component: Component, title, ...props }: IProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Component {...props} />
    </>
  )
}

export default RouteWithTitle
