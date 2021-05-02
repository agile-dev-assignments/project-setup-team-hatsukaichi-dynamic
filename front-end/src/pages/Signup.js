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
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()

    passwordReg !== passwordConfirm
      ? setPasswordMismatch(true)
      : setPasswordMismatch(false)

    // Mockaroo call goes here!
    const newUser = {
      username: usernameReg,
      email: emailReg,
      password: passwordReg
    }

    axios
      .post(`http://localhost:4000/register`, {
        username: usernameReg,
        email: emailReg,
        password: passwordReg
      })
      .then((response) => {
        console.log(response)
        history.push(`/profile/${response.data.user.id}`)
      })
      .catch((err) => {
        console.log('Error: could not make the request.')
        //history.push('/profile/1')
      })
  }

  return (
    <>
      <Header />
      <div id="signup-container">
        <form id="signup-form" onSubmit={handleSubmit}>
          <h2>Sign up for TV Tracker</h2>
          <div className="form-fields">
            <label>Username</label>
            <br />
            <input
              type="text"
              name="username"
              value={usernameReg}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              required
            />
            <br />
            <label>Email</label>
            <br />
            <input
              type="text"
              name="email"
              value={emailReg}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              required
            />
            <br />
            <label>Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={passwordReg}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <label>Confirm Password</label>
            <br />
            <input
              type="password"
              name="passwordconfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            {passwordMismatch ? (
              <p className="error message">
                Could not create account--passwords did not match.
              </p>
            ) : null}
            <p>
              Passwords have a minimum length 8 and must contain <br />
              at least one uppercase and one lowercase letter.
            </p>
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
