import * as yup from "yup"

export const loginSchema = yup.object().shape({
  password: yup.string().required("No password provided."),
  username: yup.string().required("No username provided."),
})
