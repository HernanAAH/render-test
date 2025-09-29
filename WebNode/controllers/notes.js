const notesRouter = require('express').Router()
const note = require('../models/note')
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { error } = require('../utils/logger')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.get('/', async(request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

notesRouter.get('/:id', async(request, response, next) => {
  try{
    const note =await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    }else{
      response.status(404).end()
    }
  }catch(exception){
    next(exception)
  }
})

notesRouter.post('/', async(request, response, next) => {
  const body = request.body
  try{  
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json({error: 'token invalid'})
  }
  const user = await User.findById(body.userId)

  if (!user) {
    return response.status(400).json({ error: 'invalid userId' })
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined? false : body.important,
    user:user._id
  })
  
    const saveNote = await note.save()
    user.notes = user.notes.concat(saveNote._id)
    await user.save()
    response.status(201).json(saveNote)
  }catch(exception){
    next(exception)
  }
})

notesRouter.delete('/:id', async(request, response, next) => {
  try{
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }catch(exception){
    next(exception)
  }
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch((error) => next(error))
})

module.exports = notesRouter