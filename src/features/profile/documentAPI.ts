import { AxiosResponse } from "axios"
import queryString from "query-string"
import { identity, isNil, omitBy, pickBy } from "lodash"

import {
  IDeleteDoc,
  IFilter,
  IPostDoc,
  TPostDocRes,
  ISendDoc,
  TSendDocRes,
  TDocs,
  TFilter,
  TMapTableRes,
  TStates,
  IRetryDoc,
} from "../../app/types"
import { axiosWithAlert, getRequest, putRequest } from "../../app/axiosClient"

const getMapTableRequest = async (
  docId: number,
): Promise<AxiosResponse<TMapTableRes, any>> => {
  return getRequest<TMapTableRes>("/booking/document/mapTable/" + docId)
}

const getDocumentsRequest = async (): Promise<AxiosResponse<TDocs, any>> => {
  return getRequest<TDocs>("/booking/document/list")
}

const getDocumentStatusRequest = async (): Promise<
  AxiosResponse<TStates, any>
> => {
  return getRequest<TStates>("/booking/document/status")
}

const filterDocumentsRequest =
  (from: number, size: number, initArgs: object) =>
  async (docId: string, startData: string, endDate: string, state: string) => {
    const params = pickBy(
      {
        ...initArgs,
        docId,
        state,
        endDate,
        startData,
        offset: from,
        take: size,
      },
      identity,
    )
    const result = await getRequest<TFilter>(
      `/booking?${queryString.stringify(params)}`,
    )
    return {
      count: (result.data.data as IFilter).recordsTotal,
      results: (result.data.data as IFilter).data,
    }
  }

const sendDocumentRequest = (body: ISendDoc) => {
  return axiosWithAlert.post<TSendDocRes>("/booking/document", body, {
    headers: {
      "x-success-component": "SendDocumentSuccess",
    },
  })
}

const postDocumentRequest = ({ id, ...another }: IPostDoc) => {
  const params = omitBy(another, isNil)
  console.log("params", params)
  return putRequest<{}, TPostDocRes>(
    "/booking/document/" + id + `?${queryString.stringify(params)}`,
    {},
  )
}

const deleteDocumentRequest = (body: IDeleteDoc) => {
  return axiosWithAlert.delete<any>("/booking/document", {
    headers: {
      "x-success-component": "DeleteDocumentSuccess",
    },
    data: body,
  })
}

const retryDocumentRequest = ({ company, docId }: IRetryDoc) => {
  if (!company || !docId) {
    throw new Error("Company or Document ID is missing")
  }
  return axiosWithAlert.put<any>(
    `/retry/document/${docId}?company=${encodeURIComponent(
      company,
    )}&isIfrs=false`,
  )
}

export {
  getMapTableRequest,
  getDocumentsRequest,
  sendDocumentRequest,
  postDocumentRequest,
  deleteDocumentRequest,
  filterDocumentsRequest,
  getDocumentStatusRequest,
  retryDocumentRequest,
}
