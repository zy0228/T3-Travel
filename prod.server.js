const express  = require('express')

const app = new express ()

app.use(express.static('./dist'))

const port = process.env.PORT || 8800

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})