
const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URL : process.env.mongodb_url

module.exports = {
  MONGODB_URI,
  PORT
}