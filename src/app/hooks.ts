import { useCallback, useEffect, useState, useMemo } from "react"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "./store"
import { Fetcher } from "./types"
import constants from "../utils/constants"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function usePagination<T>(
  items: Array<T>,
  defaultPageSize?: number,
  defaultCurrentPage?: number,
) {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage || 0)
  const [pageSize, setPageSize] = useState(defaultPageSize || 10)

  useEffect(() => {
    if (items.length < pageSize) {
      setCurrentPage(0)
    }
  }, [items, pageSize])

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setCurrentPage(newPage)
    },
    [],
  )

  const handleChangePageSize = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  const itemsListCrop = items.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  )

  return {
    itemsListCrop,
    currentPage,
    pageSize,
    handleChangePage,
    handleChangePageSize,
  } as const
}

// usePaginatedFetcher
export function usePaginatedFetcher<T, Fn extends Fetcher<T>>(
  fetch: Fn,
  initArgs = {},
  size = 10,
) {
  type Return = ReturnType<typeof fetch>

  const [count, setCount] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [loadingNextPage, setLoadingNextPage] = useState(false)
  const [allData, setAllData] = useState<{ page: number; data: T[] }[]>([])

  // const endReached = currentPage * size >= count
  const totalPage = Math.ceil(count / size)

  const fetchData = useCallback(
    (state: string, page: number = 1) =>
      async (...args: any[]) => {
        if (true) {
          let from

          if (
            state === constants.PAGINATION_STATES.refresh ||
            state === constants.PAGINATION_STATES.initial
          ) {
            from = 0
          } else if (page === 1) {
            from = (currentPage - 1) * size
          } else {
            from = (page - 1) * size
          }

          try {
            const response = await fetch(from, size, initArgs)(...args)
            const newResult = {
              data: response.results,
              page: state === constants.PAGINATION_STATES.refresh ? 1 : page,
            }

            if (state === constants.PAGINATION_STATES.refresh) {
              setCurrentPage(1)
              setAllData([newResult])
            } else {
              setAllData((prevAllData) => {
                return newResult.data!.length === 0
                  ? [newResult]
                  : [...prevAllData, newResult]
              })
            }

            setCount(response.count)
            setLoaded(true)
            return response
          } catch (err) {
            setError(true)
          }
        }
      },
    [currentPage, size, fetch, initArgs],
  )

  const fetchInitial = useCallback(
    async (...args: any[]) => {
      if (!loadingInitial) {
        setLoaded(false)
        setLoadingInitial(true)
        try {
          return await fetchData(constants.PAGINATION_STATES.initial)(...args)
        } finally {
          setLoadingInitial(false)
        }
      }
    },
    [fetchData, loadingInitial],
  ) as Return

  const refresh = useCallback(
    async (...args: any[]) => {
      if (!refreshing) {
        setRefreshing(true)
        try {
          return await fetchData(constants.PAGINATION_STATES.refresh)(...args)
        } finally {
          setRefreshing(false)
        }
      }
    },
    [fetchData, refreshing],
  ) as Return

  const fetchNextPage = useCallback(
    (...args: any[]) =>
      async (page: number) => {
        if (!loadingNextPage) {
          setLoadingNextPage(true)
          try {
            return await fetchData(
              constants.PAGINATION_STATES.default,
              page,
            )(...args)
          } finally {
            setLoadingNextPage(false)
          }
        }
      },
    [fetchData, loadingNextPage],
  )

  const handlePage = useCallback(
    (...args: any[]) =>
      async (page: number) => {
        if (!loadingNextPage && page <= totalPage) {
          setCurrentPage(page)
          if (!allData.find((item) => item.page === page)) {
            return await fetchNextPage(...args)(page)
          }
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(allData), fetchNextPage, loadingNextPage, totalPage],
  )

  const itemsListCrop = useMemo(() => {
    return allData.find((item: any) => item.page === currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(allData), currentPage])

  return {
    allData,
    loadingInitial,
    loadingNextPage,
    refreshing,
    loaded,
    error,
    fetchInitial,
    fetchNextPage,
    refresh,
    itemsListCrop,
    count,
    totalPage,
    currentPage,
    handlePage,
  }
}
