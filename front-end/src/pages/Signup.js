import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Signup.css'
import axios from 'axios'
require('dotenv').config()

function Signup() {
  const [usernameReg, setUsername] = useState('')
  const [emailReg, setEmail] = useState('')
  const [passwordReg, setPassword] = useState('')
  const [errorMsgSign, setErrorMsgSign] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const history = useHistory()
  function handleSubmit(e) {
    e.preventDefault()

    passwordReg !== passwordConfirm
      ? setPasswordMismatch(true)
      : setPasswordMismatch(false)

    axios
      .post('http://localhost:4000/register', {
        username: usernameReg,
        email: emailReg,
        password: passwordReg
      })
      .then((response) => {
        history.push(`/login`)
      })
      .catch((err) => {
        if (err.response.data != null) {
          setErrorMsgSign(err.response.data.errors[0].msg)
        }
      })
  }

  return (
    <>
      <Header />
      <div id="signup-container">
        <form id="signup-form" onSubmit={handleSubmit}>
          <h1 id="signup-header">Register for TV Tracker</h1>
          <div className="form-fields">
            <br />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={usernameReg}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              required
            />
            <br />

            <br />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={emailReg}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              required
            />
            <br />

            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={passwordReg}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />

            <br />
            <input
              type="password"
              name="passwordconfirm"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            {passwordMismatch ? (
              <p className="error-message-sign">
                Could not create an account - passwords do not match.
              </p>
            ) : null}
            <p className="error-message-sign">{errorMsgSign}</p>
          </div>
          <button id="signup-button" type="submit">
            Sign Up
          </button>
          <p id="question">
            Already have an account?{' '}
            <Link to="/login" className="signup-links">
              Log In.
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  )
}

export default Signup
