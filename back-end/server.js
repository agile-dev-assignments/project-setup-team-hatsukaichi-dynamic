#!/usr/bin/env/ node

//loading the web server
const server = require('./app')

//the port to listen to for incoming requests
const port = 4000

//call to start listening
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})

//function to close listener
const close = () => {
  listener.close()
}

module.exports = {
  close: close
}
