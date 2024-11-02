import { AxiosResponse } from "axios"
import { getRequest } from "../../app/axiosClient"
import { ApiError, TCompanies } from "../../app/types"

const getCompaniesRequest = async (): Promise<
  AxiosResponse<TCompanies, ApiError>
> => {
  return getRequest<TCompanies>("/booking/company/list")
}

export { getCompaniesRequest }
