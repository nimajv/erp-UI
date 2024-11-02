import * as React from "react"
import iconsUrl from "/static/images/icons.svg?url"

interface IconProps {
  name: string
  size: number
  color?: string
}

const Icon = ({ name, color, size }: IconProps) => {
  if (name === "partial") return <PartialIcon width={size} height={size} />
  if (name === "running")
    return <RunningPostingIcon width={size} height={size} />

  return (
    <svg
      width={size}
      height={size}
      fill={color || "none"}
      className={`icon icon-${name}`}
    >
      <use xlinkHref={`${iconsUrl}#icon-${name}`} />
    </svg>
  )
}

export default Icon

function PartialIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="#0077CC" {...props}>
      <path
        fillRule="evenodd"
        d="M2.5 3.5v3h3v-3h-3zM2 2a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V3a1 1 0 00-1-1H2zm4.655 8.595a.75.75 0 010 1.06L4.03 14.28a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.095-2.095a.75.75 0 011.06 0zM9.75 2.5a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm0 5a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm0 5a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5z"
      />
    </svg>
  )
}

function RunningPostingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="#852b92" viewBox="0 0 16 16" {...props}>
      <path d="M4 3.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-8z" />
      <path d="M2 2a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V2zm10-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V2a1 1 0 00-1-1z" />
    </svg>
  )
}
