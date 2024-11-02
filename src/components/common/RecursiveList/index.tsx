import { memo } from "react"
import { TList } from "../../../app/types"
import ListItem from "./ListItem"

interface RecursiveListProps {
  list: TList
  itemClickHandler: (url: string) => void
  checkIsActive: (url: string) => boolean
}

const RecursiveList = ({
  list,
  itemClickHandler,
  checkIsActive,
}: RecursiveListProps) => {
  return (
    <div className="list">
      <p style={{ margin: 0 }}>{list.title}</p>
      <ul>
        {(list.sub || []).map((item: any, index: number) => (
          <ListItem
            key={index}
            item={item}
            itemClickHandler={itemClickHandler!}
            checkIsActive={checkIsActive!}
          />
        ))}
      </ul>
    </div>
  )
}

export default memo(RecursiveList)
