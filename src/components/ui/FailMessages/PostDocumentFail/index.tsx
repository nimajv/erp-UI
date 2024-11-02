import React from "react"
import Tooltip from "../../../common/Tooltip"
import Button from "../../../common/Button"
import { IErrorRes } from "../../../../app/types"
import { copyWithToast } from "../../../../utils/functions"

const PostDocumentFail = ({ errors }: { errors: IErrorRes[] }) => {
  return (
    <div className="post-document-fail">
      <p>There are errors in the following logs.</p>
      <div className="post-document-fail__errors">
        {errors?.map((error) => (
          <Tooltip
            key={error?.DocId}
            placement="top"
            title={error?.Message || "Something went wrong!"}
            modifier="error"
          >
            <Button
              variant="text"
              modifier="error"
              onClick={() => {
                copyWithToast(error.DocId!)
              }}
            >
              {error?.DocId || "Unknown log id"}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default PostDocumentFail
