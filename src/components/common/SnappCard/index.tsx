import React from "react"

interface SnappCardProps {
  children: React.ReactNode
}

interface SnappCardHeaderProps {
  children: React.ReactNode
}

interface SnappCardBodyProps {
  children: React.ReactNode
}

interface SnappCardFooterProps {
  children: React.ReactNode
}

const SnappCard = ({ children }: SnappCardProps) => (
  <div className="snapp-card">{children}</div>
)

SnappCard.Header = (props: SnappCardHeaderProps) => (
  <div className="snapp-card__header">{props.children}</div>
)

SnappCard.Body = (props: SnappCardBodyProps) => (
  <div className="snapp-card__content">{props.children}</div>
)

SnappCard.Footer = (props: SnappCardFooterProps) => (
  <div className="snapp-card__footer">{props.children}</div>
)

export default SnappCard
