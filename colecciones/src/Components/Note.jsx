const Note = ({note, toggleImportance}) => {
  const label = note.important? "marcar como no importante" : "marcar como importante"
  return (
    <li className='notes'>{note.content}
    <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note