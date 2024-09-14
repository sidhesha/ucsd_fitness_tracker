const mongoose = require('mongoose')
mongoose.Promise = global.Promise
let MONGO_URL
const MONGO_LOCAL_URL = 'mongodb://127.0.0.1:27017/'

// Use local DB if environment variable isn't set
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
  MONGO_URL = process.env.MONGO_URI
} else {
  mongoose.connect(MONGO_LOCAL_URL) 
  MONGO_URL = MONGO_LOCAL_URL
}

const db = mongoose.connection
db.on('error', err => {
  console.log(`MongoDB connection error: ${err}`)
})
db.once('open', () => {
  console.log(
    `Connected to MongoDB: ${MONGO_URL}`
  )
})

module.exports = db
