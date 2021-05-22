const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()
const cors = require('cors')
const morgan = require('morgan') // middleware for logging of incoming HTTP requests
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const isImageURL = require('image-url-validator').default
const passport = require('passport') //authentication middleware
const LocalStrategy = require('passport-local').Strategy
const authRoute = require('./routes/auth')
const secureRoute = require('./routes/secure-route')
require('dotenv').config({ silent: true })
const { body, validationResult } = require('express-validator')
const User = require('./models/User')
const { ShowModel } = require('./models/Show')
const {
  mockAllShows,
  mockShowAPI,
  createMockUser,
  mockUserUpdate
} = require('./MockData')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev')) // dev is a concise color-coded default style for morgan
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(cors())
app.options('*', cors())

//MongoDB setup
let dbName
if (process.env.NODE_ENV === 'test') {
  dbName = 'unit_tests'
} else {
  dbName = 'test' // Perhaps change this later, but this is the database we're using for development purposes
}
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.a1meh.mongodb.net/${dbName}?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`

mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(`Connected successfully to the ${dbName} database`)
  })
  .catch((err) => console.log(err))

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB Error: '))

//routes
app.get('/tv_users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(404).json('Error: could not find users.')
  }
})

app.use('/', authRoute)
app.use(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  secureRoute
)

app.get('/', function (req, res, next) {
  res.send('TV Tracker App Home page!')
})

app.get('/tv_users/:id', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ id: req.params.id })
    if (foundUser === null) {
      throw 404
    } else {
      res.json(foundUser)
    }
  } catch (err) {
    //console.log(err)
    res.status(404).json('Error! User with requested ID not found.')
  }
})

app.post(
  '/tv_users',
  body('email').isEmail().normalizeEmail(),
  body('username').isAlphanumeric().not().isEmpty().trim().escape(),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false
    })
    .not()
    .contains(' ')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    axios
      .post(
        `https://my.api.mockaroo.com/tv_users.json?key=${process.env.API_KEY_MOCKAROO}&__method=POST`,
        {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        }
      )
      .then((response) => {
        res.json(response.data)
      })
      .catch((err) => {
        if (err.response.status === 500) {
          res
            .status(200)
            .json(
              createMockUser(
                1,
                req.body.username,
                req.body.password,
                req.body.email
              )
            )
        } else if (err.response.status === 400) {
        } else {
          res.status(401).json({
            status: 'error',
            error: {
              message: 'Mockaroo Error: Mock User(s) cannot be created'
            }
          })
        }
      })
  }
)

app.get('/shows', (req, res, next) => {
  axios
    .get(
      `https://my.api.mockaroo.com/shows.json?key=${process.env.API_KEY_MOCKAROO}`
    )
    .then((response) => {
      res.json(response.data)
    })
    .catch((err) => {
      if (err.response.status === 500) {
        res.status(200).json(mockAllShows)
      } else {
        res.status(401).json({
          status: 'error',
          error: {
            message: 'Mockaroo Error: Mock Shows cannot be retrieved'
          }
        })
      }
    })
})

app.patch(
  '/tv_users/:id',
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email.'),
  body('username')
    .optional()
    .isAlphanumeric()
    .not()
    .isEmpty()
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage(
      'Username can contain only letters and digits. Length should be at least 2 characters.'
    ),
  body('password')
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      returnScore: false
    })
    .withMessage(
      'Password can contain only letters and digits. It must contain at least 1 lowercase, 1 uppercase and 1 numeric character. Length should be at least 8 characters.'
    )
    .not()
    .contains(' ')
    .not()
    .isEmpty()
    .trim()
    .escape(),
  body('shows.*.episode').optional().isInt(),
  body('shows.*.season').optional().isInt(),
  body('img')
    .optional()
    .isURL()
    .not()
    .isEmpty()
    .withMessage('Profile picture must be a valid URL!'),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const finalUser = await User.findOne({ id: req.params.id })
    let patchUser = finalUser
    if (!patchUser) {
      return res.status(400).json('Error! No user with that ID exists.')
    }
    if (req.body.email) {
      const emailExist = await User.findOne({ email: req.body.email })
      if (emailExist && !(req.body.email === finalUser.email)) {
        return res.status(400).json('Error! Email already in use.')
      }
      patchUser = await User.updateOne(
        { id: req.params.id },
        { email: req.body.email }
      )
    }
    if (req.body.username) {
      const usernameExist = await User.findOne({
        username: req.body.username
      })
      if (usernameExist && !(req.body.username === finalUser.username)) {
        return res.status(400).json('Error! Username already in use.')
      }
      patchUser = await User.updateOne(
        { id: req.params.id },
        { username: req.body.username }
      )
    }
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10)
      const hash = await bcryptjs.hash(req.body.password, salt)
      patchUser = await User.updateOne(
        { id: req.params.id },
        { password: hash }
      )
    }
    if (req.body.bio) {
      patchUser = await User.updateOne(
        { id: req.params.id },
        { bio: req.body.bio }
      )
    }
    if (req.body.shows) {
      patchUser = await User.updateOne(
        { id: req.params.id },
        { shows: req.body.shows }
      )
    }
    if (req.body.img) {
      const isImage = await isImageURL(req.body.img)
      if (!isImage) {
        return res.status(400).json('Error! Must be a valid link to an image.')
      }
      patchUser = await User.updateOne(
        { id: req.params.id },
        { img: req.body.img }
      )
    }
    patchUser = await User.findOne({ id: req.params.id })
    res.status(200).json(patchUser)
  }
)

app.get('/shows-trakt', (req, res, next) => {
  //Return a list of popular shows if search query is not given
  if (Object.keys(req.query).length === 0) {
    axios
      .get(`https://api.trakt.tv/shows/popular`, {
        headers: {
          'trakt-api-version': 2,
          'trakt-api-key': `${process.env.API_KEY_TRAKT}`,
          Accept: '*/*'
        }
      })
      .then((response) => {
        res.json(response.data)
      })
      .catch((err) => {
        res.status(err.response.status).json({
          status: 'error',
          error: {
            message: 'An error occurred loading shows from Trakt!'
          }
        })
      })
    //otherwise return requested show information
  } else {
    axios
      .get(
        `https://api.trakt.tv/search/show,movie?query=${req.query.query}&Content-Type=application/json&trakt-api-version=2&trakt-api-key=${process.env.API_KEY_TRAKT}`,
        {
          headers: {
            'trakt-api-version': 2,
            'trakt-api-key': `${process.env.API_KEY_TRAKT}`,
            Accept: '*/*'
          }
        }
      )
      .then((response) => {
        res.json(response.data)
      })
      .catch((err) => {
        res.status(err.response.status).json({
          status: 'error',
          error: {
            message: 'An error occurred loading shows from Trakt!'
          }
        })
      })
  }
})

app.get('/movies/:id', (req, res, next) => {
  const notFoundError = {
    status: 404,
    error: 'Not Found - method exists, but no record found',
    message: 'Content with the indicated Trakt ID could not be found',
    path: '/movies/:id'
  }

  let response_final = {}

  const traktURL = `https://api.trakt.tv/movies/${req.params.id}`

  axios
    .get(traktURL, {
      params: {
        extended: 'full'
      },
      headers: {
        'trakt-api-version': '2',
        'trakt-api-key': `${process.env.API_KEY_TRAKT}`,
        extended: 'full',
        Accept: '*/*', //necessary since requests have multiple content-types
        'User-Agent': 'request'
      }
    })
    .then((traktResponse) => {
      response_final = traktResponse.data
      response_final['type'] = 'movie'
      return axios.get(
        `https://api.themoviedb.org/3/movie/${traktResponse.data.ids.tmdb}/images?api_key=${process.env.API_KEY_TMDB}`
      )
    })
    .then((posterResponse) => {
      response_final['poster-url'] =
        'https://image.tmdb.org/t/p/w500' +
        posterResponse.data.posters[0].file_path
      res.json(response_final)
    })
    .catch((err) => {
      res.json(notFoundError)
    })
})

app.get('/shows/:id', (req, res, next) => {
  const notFoundError = {
    status: 404,
    error: 'Not Found - method exists, but no record found',
    message: 'Content with the indicated Trakt ID could not be found',
    path: '/shows/:id'
  }

  let response_final = {}

  const traktURL = `https://api.trakt.tv/shows/${req.params.id}`
  const seasonURL = `https://api.trakt.tv/shows/${req.params.id}/seasons`

  axios
    .get(traktURL, {
      params: {
        extended: 'full'
      },
      headers: {
        'trakt-api-version': '2',
        'trakt-api-key': `${process.env.API_KEY_TRAKT}`,
        extended: 'full',
        Accept: '*/*', //necessary since requests have multiple content-types
        'User-Agent': 'request'
      }
    })
    .then((traktResponse) => {
      response_final = traktResponse.data
      response_final['type'] = 'show'
      return axios.get(
        `https://api.themoviedb.org/3/tv/${traktResponse.data.ids.tmdb}/images?api_key=${process.env.API_KEY_TMDB}`
      )
    })
    .then((posterResponse) => {
      response_final['poster-url'] =
        'https://image.tmdb.org/t/p/w500' +
        posterResponse.data.posters[0].file_path
      return axios.get(seasonURL, {
        headers: {
          'trakt-api-version': '2',
          'trakt-api-key': `${process.env.API_KEY_TRAKT}`,
          Accept: '*/*', //necessary since requests have multiple content-types
          'User-Agent': 'request'
        }
      })
    })
    .then((seasonResponse) => {
      // If there is a "season 0" for the show on Trakt, subtract one to account for that
      response_final['seasons'] = seasonResponse.data.length
      if (seasonResponse.data[0].number === 0) {
        response_final['seasons'] -= 1
      }
      res.json(response_final)
    })
    .catch((err) => {
      res.json(notFoundError)
    })
})

module.exports = app
