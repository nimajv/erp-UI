import { postRequest } from "../../app/axiosClient"
import { ILogin, IUser } from "../../app/types"

const loginUserRequest = (body: ILogin) => {
  return postRequest<ILogin, IUser>("/authenticate", body)
}

export { loginUserRequest }
