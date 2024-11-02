import React, { useCallback, useMemo, useState } from "react"
import { InputAdornment, TextField } from "@mui/material"
import { Close, Search } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

import WithPaper from "../../../../common/WithPaper"
import Container from "../../../../common/Container"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import {
  selectServiceItems,
  selectFavItems,
  addToFav,
} from "../../../../../features/profile/ProfileHome/serviceSlice"
import RecursiveList from "../../../../common/RecursiveList"
import { TItem } from "../../../../../app/types"
import { filterRecursive } from "../../../../../utils/functions"
import Button from "../../../../common/Button"

interface FavMenuProps {
  onClose: () => void
}

const FavMenu = ({ onClose }: FavMenuProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const services = useAppSelector(selectServiceItems)
  const favItems = useAppSelector(selectFavItems)

  const filterdServices = useMemo(
    () =>
      filterRecursive(
        Object.values(services)
          .flat()
          .filter((s) => s?.sub?.length! > 0),
        searchTerm.toLowerCase(),
      ),
    [searchTerm, services],
  ) as unknown as TItem[]

  const addServiceToFav = useCallback(
    (url: string) => {
      dispatch(addToFav(url))
    },
    [dispatch],
  )

  const checkIsFav = useCallback(
    (url: string) => {
      return favItems.includes(url)
    },
    [favItems],
  )

  return (
    <div className="fav-menu">
      <div className="fav-menu__search">
        <TextField
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("dashboard.header.search")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="medium" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div onClick={onClose} className="close-btn">
        <Close />
      </div>
      <Container className="fav-menu__items">
        {filterdServices?.map((s) => (
          <RecursiveList
            key={s.url}
            list={s}
            itemClickHandler={addServiceToFav}
            checkIsActive={checkIsFav}
          />
        ))}
      </Container>
      <Container className="fav-menu__button">
        <Button modifier="navy-blue" onClick={onClose}>
          {t("common.addToFavs")}
        </Button>
      </Container>
    </div>
  )
}

export default WithPaper(FavMenu)
