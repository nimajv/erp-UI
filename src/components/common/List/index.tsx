import { List, ListItem, ListItemText, Typography } from "@mui/material"
import { useState } from "react"

interface ListComponentProps {
  title: string
  items: string[]
  onSet: (company: string) => void
}

const ListComponent = ({ title, items, onSet }: ListComponentProps) => {
  const [activeItem, setActiveItem] = useState<string>("")

  const onChangeItem = (item: string) => {
    setActiveItem(item)
    onSet(item)
  }

  return (
    <div className="list-component">
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <List component="nav" aria-label="mailbox folders">
        {items?.map((item, idx) => (
          <ListItem
            divider
            key={idx}
            onClick={() => onChangeItem(item)}
            className={`item-component ${
              item === activeItem ? "item-component--state-active" : ""
            }`}
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default ListComponent
