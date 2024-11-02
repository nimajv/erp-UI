import { omit } from "lodash"
import * as React from "react"
import { useDispatch } from "react-redux"
import { BeatLoader } from "react-spinners"
import { useTranslation } from "react-i18next"
import { Link, Navigate } from "react-router-dom"
import { Form, Formik, FormikHelpers, FormikProps } from "formik"
import { Grid, CssBaseline, Paper, Box, Typography } from "@mui/material"

import { loginSchema } from "./validation"
import { ILogin } from "../../../app/types"
import { AppDispatch } from "../../../app/store"
import { useAppSelector } from "../../../app/hooks"
import Button from "../../../components/common/Button"
import { login, selectIsAuthenticated } from "../authSlice"
import { InputField, PasswordField } from "../../../components/common/Fields"
import { cookies } from "../../../utils/functions"
import CheckBoxFormik from "../../../components/common/Fields/CheckBox"

type ILoginForm = ILogin & { rememberme: boolean }

export default function Login() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const loginHandler = async (
    values: ILoginForm,
    actions: FormikHelpers<ILoginForm>,
  ) => {
    await dispatch(login(omit(values, "rememberme")))

    console.log("Login dispatched")

    if (values.rememberme) {
      cookies.set("rememberme", omit(values, "rememberme"))
    } else {
      cookies.remove("rememberme")
    }

    actions.setSubmitting(false)
  }

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />
  }

  return (
    <Grid container component="main" className="login">
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        square
        elevation={6}
        component={Paper}
        className="login__content"
      >
        <Box className="login__form form">
          <Typography component="h1" variant="h5">
            {t("loginPage.Welcome")}
          </Typography>

          <Box className="form__content">
            <Formik
              initialValues={{
                rememberme: !!cookies.get("rememberme"),
                username: cookies.get("rememberme")?.username || "",
                password: cookies.get("rememberme")?.password || "",
              }}
              validationSchema={loginSchema}
              onSubmit={loginHandler}
            >
              {({
                isSubmitting,
                submitForm,
                values,
              }: FormikProps<ILoginForm>) => (
                <Form noValidate>
                  <InputField
                    name="username"
                    label={t("common.username")}
                    defaultValue={values.username}
                  />

                  <PasswordField
                    name="password"
                    label={t("common.password")}
                    defaultValue={values.password}
                  />

                  <CheckBoxFormik
                    name="rememberme"
                    label="Remember me"
                    defaultValue={values.rememberme as any}
                  />

                  <Button fullWidth modifier="navy-blue" onClick={submitForm}>
                    {!isSubmitting ? (
                      <span>{t("common.login")}</span>
                    ) : (
                      <BeatLoader size={8} color="white" />
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={false} sm={4} md={6} className="login__images">
        <img src="/static/images/logo.png" alt="" />
        <img src="/static/images/login.png" alt="" />
      </Grid>
    </Grid>
  )
}
