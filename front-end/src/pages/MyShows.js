import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import './MyShows.css'
import Modal from 'react-modal'
import Select from 'react-select'
import { Link, useHistory } from 'react-router-dom'
import amazon from '../images/amazon.jpg'
import crunchyroll from '../images/crunchyroll.png'
import disney from '../images/disney.jpg'
import hbo from '../images/hbo.jpg'
import hulu from '../images/hulu.png'
import netflix from '../images/netflix.png'
import other from '../images/other.png'
import { platforms, textToValue } from '../utils/Helpers'
import { customStyles } from '../utils/DropdownStyles'
require('dotenv').config()

const ShowGrid = (props) => {
  const [shows, setShows] = useState([])
  const [filteredShows, setFilteredShows] = useState([])

  const makeAxiosCalls = (urls) => {
    return urls.map((url) => {
      return axios.get(url)
    })
  }

  useEffect(() => {
    const urls = []

    // This check is crucial--it sees whether userData (the props) has been loaded yet or not
    if (!props.shows) {
      setShows([])
      setFilteredShows([])
    } else {
      props.shows.map((show) => {
        if (show.isMovie) {
          urls.push(`http://localhost:4000/movies/${show.traktId}`)
        } else {
          urls.push(`http://localhost:4000/shows/${show.traktId}`)
        }
        return show // to satisfy warning about map expecting a return value
      })

      Promise.all(makeAxiosCalls(urls)).then((showInfo) => {
        setShows(showInfo.map((info) => info.data))
        setFilteredShows(showInfo.map((info) => info.data))
      })
    }
  }, [props.shows])

  useEffect(() => {
    if (props.shows === undefined || shows.length === 0) {
      setFilteredShows([])
    } else {
      const res = filterShows(props.shows, props.list, props.platform).map(
        (showUserInfo) => {
          return shows.find((show) => {
            if (show.ids.trakt === showUserInfo.traktId) {
              // Match in type too
              if (show.type === 'movie' && showUserInfo.isMovie) {
                const matchedShow = show
                matchedShow.platform = showUserInfo.platform
                return matchedShow
              } else if (show.type === 'show' && !showUserInfo.isMovie) {
                const matchedShow = show
                matchedShow.platform = showUserInfo.platform
                return matchedShow
              } else {
                return false
              }
            }
            return false
          })
        }
      )
      setFilteredShows(res)
    }
  }, [props.shows, props.list, props.platform, shows])

  const setPlatformLogo = (platform) => {
    let platformLogo
    if (platform === 'Amazon Prime') {
      platformLogo = amazon
    } else if (platform === 'Crunchyroll') {
      platformLogo = crunchyroll
    } else if (platform === 'Disney Plus') {
      platformLogo = disney
    } else if (platform === 'HBO') {
      platformLogo = hbo
    } else if (platform === 'Hulu') {
      platformLogo = hulu
    } else if (platform === 'Netflix') {
      platformLogo = netflix
    } else if (platform === 'Other') {
      //platform is 'other' or hasn't been set
      platformLogo = other
    }

    return platformLogo
  }

  return (
    <>
      <h3 id="title">
        My Shows {props.platform ? `- ${props.platform} Shows` : null}
      </h3>
      <div id="my-shows-container">
        {filteredShows !== undefined && filteredShows.length !== 0 ? (
          filteredShows.map((show) => {
            return (
              <Link
                to={`/${show.type}s/${show.ids.trakt}`}
                key={show.ids.trakt + '-' + show.type}>
                <img
                  className="show-images"
                  src={show['poster-url']}
                  alt={`cover-${show.ids.trakt}-${show.type}`}
                />
                {show.platform ? (
                  <img
                    className="platform-image"
                    src={setPlatformLogo(show.platform)}
                    alt={`${show.platform} logo`}
                  />
                ) : null}
              </Link>
            )
          })
        ) : (
          <p id="no-shows">No shows found...</p>
        )}
      </div>
    </>
  )
}

// filterShows filters a list of shows with user information by their list (indicated by a string)
// the list variable being passed into this function, however, is a string as to account for
// the case where no show list filtering is being done
const filterShows = (shows, list, platform) => {
  if (!shows) {
    return []
  } else {
    const filtered = shows.filter((show) => {
      if (platform === '' || show.platform === platform) {
        if (list === '') {
          return show
        }
        return show.list === list
      }
      return false
    })
    return filtered
  }
}

const MyShows = (props) => {
  const [userData, setUserData] = useState([])
  const [list, setList] = useState('')
  const [inProgressSelected, setInProgressSelected] = useState(false)
  const [completedSelected, setCompletedSelected] = useState(false)
  const [open, setOpen] = useState(false)
  const history = useHistory()

  useEffect(() => {
    axios(`http://localhost:4000/tv_users/${props.id}`)
      .then((response) => {
        setUserData(response.data)
      })
      .catch((err) => {
        console.log('Error: could not make the request.')
        console.log(err)
      })
  }, [props.id])

  const toggleModal = () => {
    setOpen(!open)
  }

  const onListChange = (buttonType) => {
    if (buttonType === 'in progress') {
      inProgressSelected ? setList('') : setList('In Progress')
      // This if statement logic ensures that the two list buttons are never on at the same time
      if (list !== '') {
        setCompletedSelected(false)
      }
      setInProgressSelected(!inProgressSelected)
    } else {
      completedSelected ? setList('') : setList('Completed')
      if (list !== '') {
        setInProgressSelected(false)
      }
      setCompletedSelected(!completedSelected)
    }
  }

  const popularShows = (shows) => {
    return shows.map((show) => {
      // Can hardcode the type since this case only gets TV Shows
      return { value: show.ids.trakt, label: show.title, type: 'shows' }
    })
  }

  const searchShows = (data) => {
    console.log(data)
    return data.map((item) => {
      return {
        value: item[item.type]['ids']['trakt'],
        label: `${item[item.type]['title']} (${item[item.type]['year']})`,
        type: `${item.type}s`
      }
    })
  }

  const loadOptions = (input) => {
    let url
    if (input) {
      url = `http://localhost:4000/shows-trakt?query=${input}`
    } else {
      url = 'http://localhost:4000/shows-trakt'
    }
    return axios
      .get(url)
      .then((response) => {
        // split into cases for popular shows or not
        if (input) {
          return searchShows(response.data)
        } else {
          return popularShows(response.data)
        }
      })
      .catch((err) => {
        console.log('Error: could not make the request.')
        console.log(err)
        return []
      })
  }

  const [selectedPlatform, setSelectedPlatform] = useState('')

  const onChange = (platform) => {
    setSelectedPlatform(platform.value)
  }

  const linkToShow = (e) => {
    history.push(`/${e.type}/${e.value}`)
  }

  return (
    <>
      <Header />
      <div id="container">
        <h3 id="profile-title">{userData.username}'s Shows</h3>
        <div id="search-container">
          <AsyncSelect
            className="search-bar"
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={linkToShow} // Change this to account for type
            placeholder="Search Shows..."
            styles={customStyles}
          />
        </div>
        <div id="filter-container">
          <button
            className={
              inProgressSelected ? 'selected filter-button' : 'filter-button'
            }
            onClick={(e) => onListChange('in progress')}>
            In Progress
          </button>
          <button className="my-shows-button" onClick={toggleModal}>
            Filter Shows
          </button>
          <Modal
            className="filter-modal"
            isOpen={open}
            onRequestClose={toggleModal}
            contentLabel="Filter Shows"
            overlayClassName="modal-open">
            <div className="modal-contents">
              <h3 id="filter-title">Filter by Platform</h3>
              <br />
              <Select
                options={platforms}
                placeholder="Select a platform"
                onChange={onChange}
                value={textToValue(selectedPlatform, 'platform')}
                styles={customStyles}
              />
              <button
                className="my-shows-button"
                id="apply"
                onClick={toggleModal}>
                Apply
              </button>
            </div>
          </Modal>
          <button
            className={
              completedSelected ? 'selected filter-button' : 'filter-button'
            }
            onClick={(e) => onListChange('completed')}>
            Completed
          </button>
        </div>
        <ShowGrid
          shows={userData.shows}
          list={list}
          platform={selectedPlatform}
        />
      </div>
      <Footer />
    </>
  )
}
export default MyShows
