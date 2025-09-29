
import Note from "./Components/Note"
import Notificacion from "./Components/Notificacion"
import { useState, useEffect, useRef } from 'react'
import noteService from './servicios/notes'
import Footer from "./Components/Footer"
import loginService from "./servicios/login"
import LoginForm from "./servicios/loginform"
import Togglable from "./Components/toggleable"
import NoteForm from "./Components/NoteForm"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("nueva nota")
  const [showAll, setShowAll] = useState([])
  const [errorMensaje, setErrormensaje] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const noteToShow = showAll ? notes : notes.filter((note) => note.important)

  const noteFormRef = useRef()

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUSer')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const handleLogin = async(event) => {
    event.preventDefault()
    
    try{
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    }catch (exception){
      setErrormensaje('wrong credentials')
      setTimeout(()=>{
        setErrormensaje(null)
      }, 5000)
    }
  }

  const handleNoteChange=(event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const loginform = () => {
    <Togglable buttonLabel='login'>
      <LoginForm 
        username={username}
        password={password}
        handleUsernameChange={({target}) => setUsername(target.value)}
        handlePasswordChange={({target}) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  }

  const noteForm = () => {
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote}/>
    </Togglable>
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notificacion mensaje={errorMensaje}/>

      {user === null ?
      loginform() :
      <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          mostrar {showAll? "importantes" : "todas"}
        </button>
        <p>{showAll? "todas las notas": "notas importantes"}</p>
      </div>
      
      <ul>
        {noteToShow.map(note => (
          <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}></Note>
        ))}
      </ul>
      <Footer></Footer>
    </div>
  )
}

export default App