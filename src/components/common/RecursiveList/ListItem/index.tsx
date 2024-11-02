import React, { memo, useCallback, useMemo } from "react"
import { TList } from "../../../../app/types"

interface ListItemProps {
  item: TList
  itemClickHandler: (url: string) => void
  checkIsActive: (url: string) => boolean
  className?: string
}

const ListItem = ({ item, itemClickHandler, checkIsActive }: ListItemProps) => {
  const subItem = (item.sub || []).map((item, idx) => (
    <ul key={idx}>
      <ListItem
        key={idx}
        item={item}
        itemClickHandler={itemClickHandler}
        checkIsActive={checkIsActive}
      />
    </ul>
  ))

  const classes = useMemo(() => {
    let classList: string[] = []
    if (item.sub?.length! > 0) {
      classList = [...classList, "list-item--state-has-child"]
    }

    if (checkIsActive(item.url!)) {
      classList = [...classList, "list-item--state-is-active"]
    }

    return classList.join(" ")
  }, [checkIsActive, item.sub?.length, item.url])

  const addToFavHandler = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      e.stopPropagation()
      item.sub === undefined && itemClickHandler(item.url!)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(item), itemClickHandler],
  )

  return (
    <li onClick={addToFavHandler} className={`list-item ${classes}`}>
      <span>{item.title}</span>
      {subItem}
    </li>
  )
}

export default memo(ListItem)
