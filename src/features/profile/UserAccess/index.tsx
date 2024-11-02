import React, { useState } from "react"
import { axiosClient } from "../../../app/axiosClient"
import "./IndexPage.css"
import axios from "axios"

const IndexPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [roles, setRoles] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [companies, setCompanies] = useState([])
  const [showCompanies, setShowCompanies] = useState(false)
  const [userNav, setUserNav] = useState([])
  const [userCompanies, setUserCompanies] = useState([])

  const API_URL = import.meta.env.VITE_APP_HOST_URL
  const handleShowCompaniesClick = async () => {
    if (showCompanies) {
      setShowCompanies(false)
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await axiosClient({
        url: "${API_URL}/user/info",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      setCompanies(response.data.companys || [])
      setMessage(`Fetched ${response.data.companys.length} companies.`)
      setShowCompanies(true)
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Submit handler for adding a company to a user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !company) {
      setMessage("Please enter both username and company name.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await axiosClient({
        url: "${API_URL}/user/create/company",
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          userName: username.toLowerCase(),
          company: [company],
        },
      })

      setMessage(
        `Company "${company}" successfully added to user "${username}".`,
      )
      setCompany("")
      handleShowCompaniesClick()
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Delete handler for removing a company from a user
  const handleDelete = async () => {
    if (!username || !company) {
      setMessage("Please enter both username and company name.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await axiosClient({
        url: "${API_URL}/user/company",
        method: "DELETE",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        data: {
          userName: username.toLowerCase(),
          company: [company],
        },
      })

      setMessage(
        `Company "${company}" successfully removed from user "${username}".`,
      )
      setCompany("")
      handleShowCompaniesClick()
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user navigation data
  const handleGetUserNav = async () => {
    setLoading(true)
    setMessage("")

    try {
      const response = await axiosClient({
        url: "${API_URL}/user/nav",
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      })

      setUserNav(response.data)
      setMessage("User nav fetched successfully.")
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch companies associated with a specific user
  const handleGetUserCompanies = async () => {
    if (!username) {
      setMessage("Please enter a username.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await axiosClient({
        url: `${API_URL}/user/info/${username.toLowerCase()}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      setUserCompanies(response.data.companys)
      setMessage("User companies fetched successfully.")
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Create a new user with specified details
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setMessage("Please enter both username and password.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      await axiosClient({
        url: "${API_URL}/user/create",
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        data: {
          username,
          password,
          roles,
        },
      })

      setMessage(`User "${username}" successfully created.`)
      setUsername("")
      setPassword("")
      setRoles(0)
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Axios errors for consistency in messaging
  const handleAxiosError = (error: unknown) => {
    console.error("An error occurred:", error)

    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 401) {
        setMessage("Unauthorized. Please check your credentials.")
      } else {
        setMessage("Failed to communicate with the server. Please try again.")
      }
    } else {
      // Handle unexpected errors
      setMessage("An unexpected error occurred. Please try again.")
    }
  }
  return (
    <div className="container">
      <div className="form-section">
        <div className="form-column">
          <div className="section">
            <h2>Manage Companies for User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button onClick={handleGetUserCompanies} disabled={loading}>
                {loading ? "Fetching..." : "Get User Companies"}
              </button>
              <div className="section">
                {userCompanies.length > 0 ? (
                  <ul>
                    {userCompanies.map((company, index) => (
                      <li key={index}>{company}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No user companies data available.</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="button-group">
                <button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Company"}
                </button>
                <button type="button" onClick={handleDelete} disabled={loading}>
                  {loading ? "Deleting..." : "Delete Company"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="form-column">
          <div className="section">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Enter role number"
                    value={roles === 0 ? "" : roles}
                    onChange={(e) => setRoles(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="button-group">
                  <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="section">
            <h2>Get All Users</h2>
            <button onClick={handleGetUserNav} disabled={loading}>
              {loading ? "Fetching..." : "Get All Users"}
            </button>

            <div className="scrollable-textbox">
              <textarea
                readOnly
                value={userNav.join("\n")}
                rows={10} // Adjust as needed
              />
            </div>
          </div>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  )
}

export default IndexPage
