import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import FactCheckIcon from "@mui/icons-material/FactCheck"
import SendIcon from "@mui/icons-material/Send"
import LoadingButton from "@mui/lab/LoadingButton"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useAppSelector } from "../../../app/hooks"
import Container from "../../../components/common/Container"
import { SelectField } from "../../../components/common/Fields"
import SnappCard from "../../../components/common/SnappCard"
import WithErrorBoundary from "../../../components/common/WithErrorBoundary"
import exportToExcel from "../../../utils/exportExcel"
import { selectUser } from "../../auth/authSlice"

import "./_victoryNox.scss"
import {
  downloadTemplate,
  getPermissions,
  sendUploadedFileToErp,
  uploadDocumentFile,
  type Permission,
  type UploadFile,
} from "./victoryNoxApi"

const headItems = [
  "Number of Records",
  "State",
  "Number of Failed Records",
  "Error File",
]

type ButtonState = "upload" | "sendErp" | "uploadErp" | "none"

const RegisterDocument = () => {
  const [uploadMethod, setUploadMethod] = useState<ButtonState>("upload")
  const [responseData, setData] = useState<UploadFile | null>(null)
  const [loading, setLoading] = useState<ButtonState>("none")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermission, setSelectedPermission] = useState<string>("")
  const user = useAppSelector(selectUser)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)

  const getPermissionsData = async () => {
    try {
      const response = await getPermissions(user.username.toUpperCase())
      setPermissions(response?.data)
    } catch (err) {}
  }

  useEffect(() => {
    getPermissionsData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file, uploadMethod)
    }
  }

  const uploadFile = (file: File, type: ButtonState) => {
    // if (!selectedPermission) return
    const method =
      type === "upload" ? uploadDocumentFile : sendUploadedFileToErp
    setLoading(type)
    method({ file, typeFile: selectedPermission })
      .then((data) => {
        setData(data?.data)
        if (!(data?.data?.isSuccess || data?.data?.IsSuccess)) {
          toast.error(data?.data?.Message || data?.data?.message)
        }
      })
      .catch(({ response }) => {
        setData(response?.data)
        toast.error(
          response?.data?.Message ||
            response?.data?.message ||
            "something is wrong",
        )
      })
      .finally(() => setLoading("none"))
  }

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeCurrentFile = () => {
    if (fileInputRef.current && fileInputRef.current.files?.[0]) {
      fileInputRef.current.value = ""
      setData(null)
      setOpen(false)
    }
  }
  const handleDownloadTemplate = () => {
    if (selectedPermission) {
      downloadTemplate(selectedPermission).then((res: any) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `template-${selectedPermission}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      })
    }
  }

  const currentDate = new Date()

  const formattedDate = `${currentDate.getFullYear()}-${padZero(
    currentDate.getMonth() + 1,
  )}-${padZero(currentDate.getDate())} ${padZero(
    currentDate.getHours(),
  )}:${padZero(currentDate.getMinutes())}`

  function padZero(num: number) {
    return num < 10 ? "0" + num : num
  }

  const handleDownloadErrorFile = () => {
    const detailsExceptions =
      responseData?.detailsExceptions || responseData?.DetailsExceptions
    const resultFile = responseData?.data?.resultFile?.validationRowFilePhonixes
    const errorFile = detailsExceptions || resultFile
    exportToExcel(errorFile, `${selectedPermission} ${formattedDate}`)
  }
  return (
    <Container className="insert-customer-data">
      <SnappCard>
        <SnappCard.Header>Data Import</SnappCard.Header>
        <SnappCard.Body>
          <div className="insert-customer-data__actions">
            <LoadingButton
              onClick={handleDownloadTemplate}
              variant="text"
              disabled={!selectedPermission}
              endIcon={<CloudDownloadIcon />}
            >
              Download Template
            </LoadingButton>
            <LoadingButton
              onClick={() => {
                if (fileInputRef?.current?.files?.[0]) {
                  setOpen(true)
                } else {
                  setUploadMethod("upload")
                  handleUploadButtonClick()
                }
              }}
              variant="contained"
              disabled={!selectedPermission}
              endIcon={<CloudUploadIcon />}
              loading={loading === "upload"}
            >
              Upload File
            </LoadingButton>
            <LoadingButton
              onClick={() => {
                if (fileInputRef?.current?.files?.[0]) {
                  setUploadMethod("sendErp")
                  uploadFile(fileInputRef?.current?.files?.[0], "sendErp")
                }
              }}
              variant="contained"
              disabled={
                (typeof responseData?.isSuccess === "boolean" &&
                  !responseData?.isSuccess) ||
                (typeof responseData?.IsSuccess === "boolean" &&
                  !responseData?.IsSuccess) ||
                !fileInputRef?.current?.files?.[0] ||
                uploadMethod === "uploadErp" ||
                uploadMethod === "sendErp" ||
                loading === "upload"
              }
              endIcon={<SendIcon />}
              loading={loading === "sendErp"}
            >
              Send To ERP
            </LoadingButton>
            <LoadingButton
              onClick={() => {
                if (fileInputRef?.current?.files?.[0]) {
                  setOpen(true)
                } else {
                  setUploadMethod("uploadErp")
                  handleUploadButtonClick()
                }
              }}
              variant="contained"
              disabled={!selectedPermission}
              loading={loading === "uploadErp"}
              endIcon={<FactCheckIcon />}
            >
              Upload/Send To ERP
            </LoadingButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <>
            {fileInputRef?.current && fileInputRef?.current.files?.[0] ? (
              <div style={{ margin: "20px 0" }}>
                {fileInputRef?.current.files?.[0]?.name}
              </div>
            ) : (
              ""
            )}
          </>
          <Divider className="divider" />
          <div className="combobox">
            <SelectField
              options={permissions?.map((per) => ({
                name: per.objectName,
                value: `${per.objectID}-${per.objectName}`,
              }))}
              name=""
              label="Table Name"
              onChange={(e: any) => {
                setSelectedPermission(e.target.value?.split("-")?.[1] as any)
                removeCurrentFile()
              }}
            />
          </div>
          {responseData && (
            <div className="insert-customer-data__content">
              <div className="insert-customer-data__data">
                <table>
                  <thead>
                    <tr>
                      {headItems.map((item) => (
                        <th key={item}>{item}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{responseData?.count || responseData?.Count}</td>
                      <td
                        className={`status ${
                          !(
                            responseData?.isSuccess || responseData?.IsSuccess
                          ) && "has-error"
                        }`}
                      >
                        {responseData?.isSuccess || responseData?.IsSuccess
                          ? "Success"
                          : "Error"}
                      </td>
                      <td>
                        {responseData?.failCount ||
                          responseData?.FailCount ||
                          0}
                      </td>
                      <td>
                        {!(
                          responseData?.isSuccess || responseData?.IsSuccess
                        ) ? (
                          <>
                            {responseData?.detailsExceptions ||
                            responseData?.DetailsExceptions ||
                            responseData?.data?.resultFile
                              ?.validationRowFilePhonixes ? (
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={handleDownloadErrorFile}
                              >
                                Download File
                              </div>
                            ) : (
                              <>-</>
                            )}
                          </>
                        ) : (
                          <>-</>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Remove Current File and Logs
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do You want to remove current logs?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>No</Button>
              <Button
                onClick={() => {
                  removeCurrentFile()
                }}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </SnappCard.Body>
      </SnappCard>
    </Container>
  )
}

export default WithErrorBoundary(RegisterDocument)
