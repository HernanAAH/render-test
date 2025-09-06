
import Note from "./Components/Note"
import Notificacion from "./Components/Notificacion"
import { useState, useEffect } from 'react'
import noteService from './servicios/notes'
import Footer from "./Components/Footer"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("nueva nota")
  const [showAll, setShowAll] = useState([])
  const [errorMensaje, setErrormensaje] = useState(null)

  const noteToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
    .update(id,changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrormensaje(
        `nota '${note.content}' ya fue removida del servidor`
      )
      console.log(errorMensaje)
      setTimeout(()=> {
        setErrormensaje(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
}

  useEffect(() => {
    noteService.get()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length+1
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote)) // mejor usar la respuesta del servidor
        console.log(returnedNote.id)
        setNewNote("")
      })
  }

  const handleNoteChange=(event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notificacion mensaje={errorMensaje}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          mostrar {showAll? "importantes" : "todas"}
        </button>
        <p>{showAll? "todas las notas": "notas importantes"}</p>
      </div>
      
      <ul>
        {noteToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}></Note>
        )}
        <form onSubmit={addNote}> 
          <input value={newNote} onChange={handleNoteChange}></input>
          <button type="submit">guardar</button>
        </form>
      </ul>
      <Footer></Footer>
    </div>
  )
}

export default App