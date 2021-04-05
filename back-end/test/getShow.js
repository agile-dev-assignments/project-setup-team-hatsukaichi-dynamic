const chai = require('chai')
const chaiHttp = require('chai-http')
const axios = require('axios')
const sinon = require('sinon')
const expect = chai.expect
const server = require('../app.js')
chai.use(chaiHttp)

describe('GET /show', () => {
  it('should return 200 OK', async () => {
    const stub = sinon.stub(axios, 'get').resolves({data: {id: 1, name: 'sample show'}})
    const res = await chai.request(server).get('/show')
    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({id: 1, name: 'sample show'})
    stub.restore()
  })
  it('should return 500 error', async () => {
    const stub = sinon.stub(axios, 'get').rejects(true)
    const res = await chai.request(server).get('/show')
    expect(res.status).to.equal(500)
    stub.restore()
  })
})