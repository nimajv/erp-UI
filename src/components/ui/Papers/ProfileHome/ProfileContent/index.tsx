import { flatten } from "lodash"
import React, { useCallback, useMemo, useRef } from "react"

import {
  selectFavItems,
  selectServiceItems,
} from "../../../../../features/profile/ProfileHome/serviceSlice"
import HomeService from "../HomeService"
import AddServicePaper from "../AddService"
import Container from "../../../../common/Container"
import WithPaper from "../../../../common/WithPaper"
import { FavMenu } from "../../../Cards/ProfileHome"
import { flattenRecursive } from "../../../../../utils/functions"
import { useAppSelector } from "../../../../../app/hooks"

const ProfileContent = () => {
  const favElRef = useRef<HTMLDivElement>(null)
  const itemsElRef = useRef<HTMLDivElement>(null)

  const favItems = useAppSelector(selectFavItems)
  const services = useAppSelector(selectServiceItems)

  const toggleFav = useCallback(() => {
    favElRef.current?.classList.toggle("d-none")
    itemsElRef.current?.classList.toggle("d-none")
  }, [])

  const favServices = useMemo(() => {
    return flatten(
      flatten(Object.values(services))
        .filter((s) => !!(s?.sub?.length! > 0))
        ?.map((s) => flattenRecursive(s)),
    ).filter((s) => favItems.includes(s.url!))
  }, [favItems, services])

  return (
    <>
      <div ref={itemsElRef}>
        <Container>
          <div className="profile-home__items">
            {React.cloneElement(AddServicePaper, {
              onClick: toggleFav,
            })}

            {favServices.map((fs) => (
              <HomeService
                key={fs.url}
                path={fs?.path || ""}
                title={fs.title!}
                url={fs.url!}
              />
            ))}
          </div>
        </Container>
      </div>
      <div className="d-none profile-home-menus" ref={favElRef}>
        <Container>
          <FavMenu onClose={toggleFav} />
        </Container>
      </div>
    </>
  )
}

export default WithPaper(ProfileContent)
