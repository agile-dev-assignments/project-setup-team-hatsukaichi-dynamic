import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './ViewUsers.css'

function ViewUsers(props) {
  const [users, setUsers] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [hasError, setError] = useState(false)

  const AllUsers = ({ users }) => {
    return (
      <>
        {users ? (
          <div id="profile-show-container">
            {users.map((user) => {
              return (
                <>
                  <div className="content">
                    <img
                      src={
                        user.img === ''
                          ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                          : user.img
                      }
                      alt=""></img>
                    <h4>{user.username}</h4>
                    <p>{user.bio === '' ? 'TV Tracker Fan' : user.bio}</p>
                    <Link to={`/profile/${user.id}`}>View Profile</Link>
                  </div>
                </>
              )
            })}
          </div>
        ) : (
          <p id="no-users">No users. Register as a new user!</p>
        )}
      </>
    )
  }
  useEffect(() => {
    axios
      .get('http://localhost:4000/tv_users')
      .then((response) => {
        console.log(response.data)
        setUsers(response.data)
      })
      .catch((err) => {
        console.log(err.response)
        setUsers([])
        setError(true)
        setErrorMsg(err.response)
      })
  }, [])
  return (
    <>
      <body>
        <Header />
        <div className="header">
          <h2 id="view-header">TV Tracker Users</h2>
          <br />
          <p id="view">
            Feel free to check out profiles of other users in our database and
            view what shows they are watching :)
          </p>
        </div>
        <AllUsers users={users} />
        {hasError ? <p>{errorMsg}</p> : ''}
        <Footer />
      </body>
    </>
  )
}

export default ViewUsers
