const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const server = require('../app.js')
const User = require('../models/User')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')(mongoose)

chai.use(chaiHttp)

describe('GET /tv_users/:id', function () {
  before(async () => {
    // Make sure database is empty first:
    await User.deleteMany({})
    // Save a user manually to the database:
    const user = new User({
      username: 'testUser',
      password: 'unhashedPwd1',
      email: 'testEmail@gmail.com',
      bio: "User's bio.",
      img: 'https://i.imgur.com/IHOjDbq.jpg',
      shows: []
    })
    await user.save()
  })
  after(async () => {
    // Remove users from the database
    await User.deleteMany({})
    // Reset the id counter for this
    await User.counterReset('id', (err) => {})
  })
  it('should return 200 OK and data for a valid id', async () => {
    const res = await chai.request(server).get('/tv_users/1')
    expect(res.status).to.equal(200)
    // Can't quite expect this to be equal to something since it changes every test
    expect(res.body).to.have.property('_id')
    expect(res.body).to.have.property('password')
    // These we can expect to be equal to something
    expect(res.body).to.have.property('username', 'testUser')
    expect(res.body).to.have.property('email', 'testEmail@gmail.com')
    expect(res.body).to.have.property('bio', "User's bio.")
    expect(res.body).to.have.property('img', 'https://i.imgur.com/IHOjDbq.jpg')
    expect(res.body).to.have.property('shows')
    expect(res.body.shows).to.be.an('array').that.is.empty
  })
  it('should return 404 and an error for a invalid user id', async () => {
    const res = await chai.request(server).get('/tv_users/badid')
    expect(res.status).to.equal(404)
    expect(res.body).to.deep.equal('Error! User with requested ID not found.')
  })
  it('should return 404 and an error for an id with no user', async () => {
    const res = await chai.request(server).get('/tv_users/100000')
    expect(res.status).to.equal(404)
    expect(res.body).to.deep.equal('Error! User with requested ID not found.')
  })
}).timeout(3000)
