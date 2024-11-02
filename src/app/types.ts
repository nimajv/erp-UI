export type TItem = {
  title?: string
  url?: string
  path?: string
}

export type TList = {
  title?: string
  url?: string
  sub?: TList[] | null
}

export type TServiceItem = {
  title?: string
  url?: string
  sub?: TServiceItem[] | null
}

export type Service = TServiceItem[]

export type TGeneral = {
  company: string
  isMenuActive: boolean
}

export type ILogin = {
  username: string
  password: string
}

export interface ISendDoc {
  snappGroup: string
  docId: number
  startDate: string
  endDate: string
  isPosting: boolean
  isDeleting: boolean
  criteria?: string
  isPartialSuccess: boolean
  userName: string
  typeRun: number
}

export interface IPostDoc {
  company?: string
  id: string
  startDate: string
  endDate: string
  isIfrs: boolean
}

export interface IDeteteDetail {
  id: string
  deletestrategyEnum: number
  startDate?: string
  endTime?: string
  isIfrs: boolean
}

export interface IDeleteDoc {
  deteteDetails: IDeteteDetail[]
}

export interface IRetryDoc {
  company: string
  docId: string
}

export interface IUser {
  token: string
  result: boolean
  username: string
  isLockedOut: boolean
  isNotAllowed: boolean
  requiresTwoFactor: boolean
  userinfo: string[]
}

export type ICompany = {
  disabled: boolean
  group?: null
  selected: boolean
  text: string
  value: string
}

export interface IGroup {
  disabled: boolean
  name: string
}

export interface IMapTable {
  id: string
  docID: string
  businessLine: string
  transactionType: string
  recurrence: string
  table: string
  groupByFields: string
  amountFields: string
  case: string
  query: string
  documentNo: string
  documentType: string
  accountType: string
  accountNo: string
  glAccountNo: string
  desc: string
  debitCredit: boolean
  businessgroup: string
  contact: string
  revenuestream: string
  costcenter: string
  city: string
  employee: string
  control: string
  fs: string
  active: boolean
  isSFTP: boolean
}

export interface IDoc {
  disabled: boolean
  group: IGroup
  selected: boolean
  text: string
  value: string
}

export interface IResponse<T> {
  data?: T[] | T | null
  isSuccess: boolean
  statusCode: number
  message: string
}

export interface IFilter {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: IFilterData[]
  error: any
}

export enum FilterStates {
  SUCCESS,
  FAIL,
  PARTIAL_SUCCESS,
  RUNNING,
  DELETE_DOCUMENT,
  EMPTY_ROW,
  POSTED,
  PARTIAL_POSTING,
  RUNNING_POSTING,
  // DELETE_BATCH,
  PARTIAL_FAIL,
}

export type FilterState = `${Extract<
  FilterStates,
  number
>}` extends `${infer N extends number}`
  ? N
  : never

export interface IFilterData {
  id: string
  businessgroup?: string
  status: FilterState
  amount: number
  documentType: string
  start_date: string
  end_date: string
  typeRun?: string
  docId: string
  messageExcetion?: string
  rowDocumentCount?: number
  versionSoftwar?: string
  creatE_DATE: string
  transactionType: string
  userName?: string
  isPosting?: boolean
  isIfrs: boolean
}

export type IState = {
  code: number
  name: string
}

export type IErrorRes = {
  IsSuccess: boolean
  StatusCode: number
  Message: string
  DocId?: string
}

export type TCompanies = IResponse<ICompany>
export type TMapTableRes = IResponse<IMapTable>
export type TDocs = IResponse<IDoc>
export type TFilter = IResponse<IFilter>
export type TSendDocRes = IResponse<{
  documentLogId: string
  statusMessage: number
  documentMessage: string
}>

export type TPostDocRes = IResponse<string>

export type TStates = IResponse<IState>

export type ApiError = {
  message: string
  status?: number
}

export interface Paginated<T> {
  count: number
  results: T[]
}

export type Fetcher<T> = (
  from: number,
  size: number,
  initArgs: object,
) => (...args: any[]) => Promise<Paginated<T>>

export interface RDContentValues {
  docId: string
  fromDate: string
  toDate: string
  status: string
}

export type ObjectWithValuesOfEnumAsKeys = { [key in FilterStates]: string }
