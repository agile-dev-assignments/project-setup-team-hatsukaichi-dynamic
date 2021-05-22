import './Login.css'
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthContext } from '../App'

function Login() {
  const [emailUser, setEmail] = useState('')
  const [passwordUser, setPassword] = useState('')
  const { loggedInUser, setLoggedInUser } = React.useContext(AuthContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [errorMsgLogin, setErrorMsgLogin] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:4000/login', {
        email: emailUser,
        password: passwordUser
      })
      .then((response) => {
        //jwt authorization : only the user with valid jwt will access profile
        if (!response.data.auth) {
          setIsLoggedIn(false)
        } else {
          setLoggedInUser(response.data.user)
          localStorage.setItem('token', response.data.user)
          setIsLoggedIn(true)
        }
      })
      .catch((err) => {
        if (err.response.data != null) {
          setErrorMsgLogin(err.response.data.error.message)
          setIsLoggedIn(false)
        }
      })
  }

  //check if user is authorized (jwt is correct)
  const userAuthorized = () => {
    axios
      .get('http://localhost:4000/checkAuth', {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      })
      .then((response) => {
        console.log(response)
      })
  }
  //only authorized users can access the profile page
  if (isLoggedIn && userAuthorized) {
    return <Redirect to={`/profile/${loggedInUser.id}`} />
  }

  return (
    <>
      <Header />
      <div id="login-container">
        <form id="login-form" onSubmit={handleSubmit}>
          <h1 id="login-header">Log in to TV Tracker</h1>
          <div className="form-fields">
            <br />
            <input
              autoFocus={true}
              type="email"
              name="email"
              placeholder="Email"
              value={emailUser}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />

            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={passwordUser}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <br />
            <button id="login-button" type="submit">
              Login
            </button>
            <br />
            <br />
            <p className="error-message-login">{errorMsgLogin}</p>
            <p>
              Not registered?{' '}
              <Link to="/signup/" className="login-links">
                Create an account.
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}
export default Login
