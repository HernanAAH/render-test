const mongoose = require('mongoose')

const password = process.env.mongodb_password

const url=`mongodb+srv://hernana860:${password}@cluster0.op29mzv.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

console.log('connecting to', url) 

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result => {
    console.log('connected to MongoDB')
    })
    .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)