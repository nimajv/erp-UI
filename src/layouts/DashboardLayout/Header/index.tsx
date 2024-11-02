import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Search, Logout, AccountCircleRounded } from "@mui/icons-material"
import { Form, Formik, FormikProps } from "formik"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import Dropdown from "../../../components/common/Dropdown"
import Container from "../../../components/common/Container"
import { InputWithIconField } from "../../../components/common/Fields"
import {
  changeCompany,
  selectCompany,
} from "../../../features/general/generalSlice"
import { selectCompanies } from "../../../features/general/companySlice"
import { logout, selectUser } from "../../../features/auth/authSlice"

const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const company = useAppSelector(selectCompany)
  const companies = useAppSelector(selectCompanies)

  return (
    <Container>
      <div className="dashboard__header header">
        <Link className="header__logo" to={"/profile"}>
          <img src="/static/images/logo.png" alt="" />
        </Link>
        {/* <div className="header__search search">
          <Formik
            initialValues={{
              service: "",
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                actions.setSubmitting(false)
              }, 1000)
            }}
          >
            {({ submitForm }: FormikProps<any>) => (
              <Form>
                <InputWithIconField
                  iconComponent={
                    <Search
                      className="search__icon"
                      onClick={submitForm}
                      fontSize="medium"
                    />
                  }
                  name="service"
                  iconPosition="start"
                  placeholder={t("dashboard.header.search")}
                />
              </Form>
            )}
          </Formik>
        </div> */}
        <div className="header__profile">
          <div className="header__info">
            <div>
              <span className="header__name">{user.username}</span>
              <Dropdown
                className="header__company"
                id="header_company"
                onChangeItem={(item) => {
                  dispatch(changeCompany(item))
                }}
              >
                <Dropdown.Title>
                  <span>{company}</span>
                </Dropdown.Title>

                <Dropdown.Content>
                  {companies.map((c, index) => (
                    <Dropdown.Item value={c.value} key={index}>
                      {c.value}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown>
            </div>
            <div className="header__photo">
              <AccountCircleRounded sx={{ fontSize: 40 }} />
            </div>
          </div>
          <p
            className="header__exit cursor-pointer"
            onClick={() => {
              dispatch(logout())
              navigate("/")
            }}
          >
            <span>Exit</span>
            <Logout />
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Header
