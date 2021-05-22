import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import './AllShows.css' // uses same styling
import { Link, useHistory } from 'react-router-dom'
require('dotenv').config()

const ShowGrid = (props) => {
  const [shows, setShows] = useState([])

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
    } else {
      props.shows.map((show) => {
        if (show.type && show.type === 'movie') {
          urls.push(`http://localhost:4000/movies/${show.ids.trakt}`)
        } else {
          urls.push(`http://localhost:4000/shows/${show.ids.trakt}`)
        }
        return show // to satisfy warning about map expecting a return value
      })

      Promise.all(makeAxiosCalls(urls)).then((showInfo) => {
        setShows(showInfo.map((info) => info.data))
      })
    }
  }, [props.shows])

  return (
    <>
      <div id="all-shows-container">
        {shows !== undefined && shows.length !== 0 ? (
          shows.map((show) => {
            return (
              <Link
                to={`/${show.type}s/${show.ids.trakt}`}
                key={show.ids.trakt + '-' + show.type}>
                <img
                  className="show-images"
                  src={show['poster-url']}
                  alt={`cover-${show.ids.trakt}-${show.type}`}
                />
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

const AllShows = (props) => {
  const [shows, setShows] = useState([])
  const history = useHistory()

  useEffect(() => {
    axios('http://localhost:4000/shows-trakt')
      .then((response) => {
        setShows(response.data)
      })
      .catch((err) => {
        console.log('Error: could not make the request.')
        console.log(err)
      })
  }, [])

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

  const linkToShow = (e) => {
    history.push(`/${e.type}/${e.value}`)
  }

  return (
    <>
      <Header />
      <div id="container">
        <h1 id="pop-shows-header">Popular Shows</h1>
        <p id="ad">Explore the most popular shows in our database!</p>
        <div id="search-container">
          <AsyncSelect
            className="search-bar"
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={linkToShow} // Change this to account for type
            placeholder="Search Shows..."
          />
        </div>
        <ShowGrid shows={shows} />
      </div>
      <Footer />
    </>
  )
}
export default AllShows
