const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jyan:abcd1234@boilerplate.pfoka.mongodb.net/<dbname>?retryWrites=true&w=majority', {
userNewUrlParser: true, userUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!`_`')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

