import { AxiosResponse } from "axios"
import {
  axiosClient,
  getRequest,
  postRequest,
  putRequest,
} from "../../../app/axiosClient"
import { ApiError } from "../../../app/types"

export type Permission = {
  userName: string
  userGroupCode: string
  roleID: string
  companyName: string
  status: string
  objectID: string
  read: true
  insert: true
  modify: true
  delete: true
  objectName: string
}

const downloadTemplate = async (
  typeFile: string,
): Promise<AxiosResponse<any, ApiError>> => {
  return axiosClient({
    url: `/booking/document/file?typeFile=${typeFile}`,
    method: "GET",
    responseType: "blob",
  })
}

const getPermissions = async (
  userName: string,
): Promise<AxiosResponse<Permission[], ApiError>> => {
  return getRequest<Permission[]>(
    `/booking/document/PermissionFile?userName=${userName}`,
  )
}

export type UploadFile = {
  count: number
  Count: number
  detailsExceptions: any
  DetailsExceptions: any
  docId: string
  DocId: string
  failCount: number
  FailCount: number
  isSuccess: boolean
  IsSuccess: boolean
  message: string
  Message: string
  statusCode: number
  StatusCode: number
  data: {
    resultFile: {
      validationRowFilePhonixes: any[]
    }
  }
}

const sendUploadedFileToErp = async ({
  file,
  typeFile,
}: {
  file: File
  typeFile: string
}): Promise<any> => {
  return putRequest<any, any>(
    `/booking/document/file?typeFile=${typeFile}`,
    {
      file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )
}
const uploadDocumentFile = async ({
  file,
  typeFile,
}: {
  file: File
  typeFile: string
}): Promise<any> => {
  return postRequest<any, any>(
    `/booking/document/file?typeFile=${typeFile}`,
    {
      file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )
}

export {
  downloadTemplate,
  getPermissions,
  sendUploadedFileToErp,
  uploadDocumentFile,
}
